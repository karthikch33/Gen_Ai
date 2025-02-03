import React from 'react'
import { Modal } from 'antd'
const CustomModel = (props) => {
    const {open,performAction,hideModal,title,data} = props
  return (
    <Modal
        open={open}
        title={title}
        onOk={performAction}
        onCancel={hideModal}
        okText="OK"
        cancelText="CANCEL"
      >
        {/* <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> */}
      </Modal>
  )
}

export default CustomModel