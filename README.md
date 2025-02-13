 <Button onClick={createFile} style={{ fontSize: '14px' }}>
                                Create
                            </Button>
                            <Modal
                              // title = "File"
                              open = {createf}
                              closable = {false}
                              footer = {null}
                              // onOk = {handleOk}
                              // onCancel={handleOk}
                              >
                                <p><FormFile /></p>
                            </Modal>
                            <Button onClick={handleEditNavigation} style={{ fontSize: '14px' }}>  
                                Edit  
                            </Button>  
                            <Button onClick={showModal} style={{ fontSize: '14px' }}>  
                                Delete  
                            </Button>  
                            <Button onClick={showModal2} style={{ fontSize: '14px' }}>  
                                Rename  
                            </Button> 
                            --------------------------------------------------------------
                            .required("Table Name is required")  
        .matches(  
            /^[a-zA-Z_.-]+$/,  
            'Table name can only contain letters, underscores, periods, and hyphens.'  
        )  
        .trim()  
        .notOneOf(['.', '', '_', '-'], 'Table name cannot be just a dot, underscore, or hyphen.')  
        .test('no-start-end-dot', 'Table name cannot start or end with a dot.', (value) => {  
            return value && !(value.startsWith('.') || value.endsWith('.'));  
        })  
        .test('no-start-end-hyphen', 'Table name cannot start or end with a hyphen.', (value) => {  
            return value && !(value.startsWith('-') || value.endsWith('-'));  
        })  
        .test('no-start-end-underscore', 'Table name cannot start or end with an underscore.', (value) => {  
            return value && !(value.startsWith('_') || value.endsWith('_'));  
        })  
        .test('no-spaces', 'Spaces are not allowed in table name.', (value) => {  
            return value && !/\s/.test(value);  
        }) 





 <Form.Item>  
                            <Input  
                                name="description"  
                                placeholder="Enter description"  
                                value={formik.values.description}  
                                onChange={formik.handleChange}  
                            />  
                            <div className="error">  
                            {formik.touched.description && formik.errors.description}  
                        </div>
                        </Form.Item>







        fileName: yup.string().required('File Name Required')
        .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid File Name'),
        tableName:  yup.string().required('Table Name Required')
        .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid Table Name'), 