import React from "react";
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import ImgCrop from 'antd-img-crop';

function getBase64(img: Blob, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

type Prop = {
  onChange: (info: UploadChangeParam) => void,
  customImage?: string,
  disabled: boolean,
};
type State = { loading: boolean, imageUrl: string };

const baseImageUrl = "http://localhost:4000/api/employee/images/";

export default class Avatar extends React.Component<Prop, State> {
  state = {
    loading: false,
    imageUrl: ""
  };

  handleChange = (info: UploadChangeParam, onChange: (info: UploadChangeParam) => void) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as Blob, (imageUrl: string) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
      onChange(info)
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const { onChange, customImage, disabled } = this.props;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const customImageUrl =  baseImageUrl + customImage;
    
    const imageToRender = imageUrl || (customImage ? customImageUrl : "");
    
    return (
      <ImgCrop>
        <Upload
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={(info) => this.handleChange(info, onChange)}
          disabled={disabled}
        >
          {imageToRender ? <img src={imageToRender} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </ImgCrop>
      
    );
  }
}