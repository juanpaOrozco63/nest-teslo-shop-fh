export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('No file found'), false)
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (validExtensions.includes(fileExtension)) {
        return callback(null, true)
    }
   callback(null,false)

}