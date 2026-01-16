import { Form, Input, Button, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export const LoginPage = () => {
   const onFinish = (values: any) => {
      console.log('Login:', values)
      alert('Chức năng đăng nhập sẽ được implement sau!')
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
         <Card className="w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold mb-2">Đăng Nhập</h1>
               <p className="text-gray-600">Đăng nhập để tiếp tục mua sắm</p>
            </div>

            <Form
               name="login"
               onFinish={onFinish}
               layout="vertical"
               size="large"
            >
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: 'Vui lòng nhập email!' },
                     { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
               >
                  <Input
                     prefix={<UserOutlined />}
                     placeholder="Email"
                  />
               </Form.Item>

               <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
               >
                  <Input.Password
                     prefix={<LockOutlined />}
                     placeholder="Mật khẩu"
                  />
               </Form.Item>

               <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                     Đăng nhập
                  </Button>
               </Form.Item>
            </Form>

            <div className="text-center">
               <Link to="/" className="text-blue-600 hover:underline">
                  ← Quay về trang chủ
               </Link>
            </div>
         </Card>
      </div>
   )
}
