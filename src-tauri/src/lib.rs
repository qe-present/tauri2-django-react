use tauri::{AppHandle, Manager, State};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandChild;
use std::sync::{Arc, Mutex};
use tauri::WindowEvent;


fn start(app_handle: AppHandle) -> Result<Option<CommandChild>, String> {
    // 准备
    let sidecar_command = app_handle.shell()
        .sidecar("manage")
        .map_err(|e| format!("Failed to create sidecar command: {}", e))?
        .args(["runserver", "--noreload"]);

    // 启动 Sidecar 进程，返回 CommandChild
    let (_, child) = sidecar_command.spawn()
        .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;

    Ok(Some(child))
}

fn stop(sidecar_child: State<Arc<Mutex<Option<CommandChild>>>>) -> bool {
    if let Some(child) = sidecar_child.lock().unwrap().take() {
        println!("准备关闭manage.exe进程");
        // 尝试杀死进程
        if let Err(_) = child.kill() {
            println!("关闭失败");
            return false;
        }
    }
    println!("关闭成功");
    true
}
fn close_all_windows(app_handle: AppHandle){
    let windows=app_handle.webview_windows();
    for (_,window) in windows {
        println!("关闭窗口");
        if let Err(e) = window.close() {
            println!("{:#?}",e)
        }


    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let sidecar_child = Arc::new(Mutex::new(None)); // 用于存储 CommandChild 对象
            app.manage(sidecar_child.clone()); // 将 sidecar_child 存储在全局状态中
            let app_handle = app.handle().clone();
            match start(app_handle) {
                Ok(child_opt) => {
                    // 存储子进程句柄
                    *sidecar_child.lock().unwrap() = child_opt;
                }
                Err(e) => {
                    print!("{}",e)
                }
            }

            Ok(())
        })
        .on_window_event(move |window, event| {
            if let WindowEvent::CloseRequested {api, .. } = event {
                println!("触发close事件");
                // 获取 Sidecar 进程句柄
                let sidecar_child = window.state::<Arc<Mutex<Option<CommandChild>>>>();
                let _ = stop(sidecar_child);
                let app_handle = window.app_handle();
                close_all_windows(app_handle.clone());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}