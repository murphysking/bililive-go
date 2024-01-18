import { Modal, Input,Checkbox } from 'antd';
import React from 'react';
import API from '../../utils/api';

const api = new API();

interface Props {
    refresh?: any
}

class AddRoomDialog extends React.Component<Props> {
    state = {
        ModalText: '请输入直播间的URL地址',
        visible: false,
        confirmLoading: false,
        textView: '',
        //实验性功能
        newhevc:false//使用新hevc流处理方法
    };

    showModal = () => {
        this.setState({
            ModalText: '请输入直播间的URL地址',
            visible: true,
            confirmLoading: false,
        });
    };

    handleOk = () => {
        this.setState({
            ModalText: '正在添加直播间......',
            confirmLoading: true,
        });

        api.addNewRoom(this.state.textView,this.state.newhevc)
            .then((rsp) => {
                // 保存设置
                api.saveSettingsInBackground();
                this.setState({
                    visible: false,
                    confirmLoading: false,
                    textView:'',
					newhevc:false
                });
                this.props.refresh();
            })
            .catch(err => {
                alert(`添加直播间失败:\n${err}`);
                this.setState({
                    visible: false,
                    confirmLoading: false,
                    textView:'',
					newhevc:false
                });
            })
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            textView:''
        });
    };

    textChange = (e: any) => {
        this.setState({
            textView: e.target.value
        })
    }

	newhevcOnChange = (e:any) => {
		this.setState({
			newhevc:e.target.checked
		})
	  };

    render() {
        const { visible, confirmLoading, ModalText,textView,newhevc } = this.state;
        return (
            <div>
                <Modal
                    title="添加直播间"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}>
                    <p>{ModalText}</p>
                    <Input size="large" value={textView} placeholder="https://" onChange={this.textChange} />
					<br/>
					<Checkbox style={{marginTop:"5px"}} onChange={this.newhevcOnChange} value={newhevc}>新hevc流处理方法(<label style={{color:"red"}}>实验性功能，目前仅在YY直播下测试通过</label>)</Checkbox>
                </Modal>
            </div>
        );
    }
}

export default AddRoomDialog;
