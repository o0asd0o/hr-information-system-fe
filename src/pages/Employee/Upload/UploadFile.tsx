import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';

const onChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

export default () => {
    return (
        <Upload 
            name='file'
            onChange={onChange}
            maxCount={3}
        >
            <Button icon={<UploadOutlined />}>Upload (Max: 3)</Button>
        </Upload>
    );
}