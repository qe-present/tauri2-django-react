import './btn.css'
import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow';

export default function AddButton(){
    async function handleAddBook() {
        let webviewWindows = await getAllWebviewWindows();
        let addWindow=webviewWindows.find((webviewWindow) => webviewWindow.label==='add')
        if (addWindow) {
            addWindow.show();
            addWindow.once('tauri://close-requested',()=>{
                addWindow.hide()
            })
        }
    }

    return (
        <>
            <button className="add-btn" onClick={handleAddBook}>添加图书</button>
        </>
    )
}