import {
    ArrowDown,
    Plus,
    Delete,
    Edit,
    Search,
    Close,
    Loading,
    DocumentCopy,
    UploadFilled,
    Printer,
    Finished,
    Share,
    EditPen,
    RefreshRight,
    DocumentRemove,
    CaretLeft,
    CaretRight,
    SemiSelect,
    Box, DataAnalysis, List, Aim, Document, CloseBold, Minus, More,
    Ticket, ScaleToOriginal, Crop, InfoFilled, RefreshLeft, Setting
} from '@element-plus/icons-vue'

const icons = {
    ArrowDown, Plus, Delete, Edit, Search, Close, Loading,
    UploadFilled, Printer, Finished, Share, EditPen,
    DocumentRemove, CaretLeft, CaretRight, SemiSelect, DocumentCopy, RefreshRight, Box, DataAnalysis, List, Aim, Document, CloseBold, Minus, More, Ticket, ScaleToOriginal, Crop, InfoFilled, RefreshLeft, Setting
}

export function setupIcons(app) {
    for (const [key, component] of Object.entries(icons)) {
        app.component(key, component)
    }
}