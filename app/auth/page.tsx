"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Flex, Checkbox, Spin } from "antd";
import '@ant-design/v5-patch-for-react-19';
import { hasTokenInCookies, login, setTokenInCookies } from '../services/user-access';
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверка авторизации
        if (hasTokenInCookies()) {
            router.replace("/dashboard");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 50 }} />
            </div>
        );
    }

    const handleLogin = (values: { email: string; password: string }) => {
        setTimeout(async () => {
            try {
                const response = await login(values.email, values.password);

                if (response.detail) {
                    if (Array.isArray(response.detail))
                        response.detail.forEach((err: { msg: string }) => message.error(err.msg));
                    else
                        message.error("Непредвиденная ошибка. Повторите попытку или попробуйте выполнить запрос позже. (" + response.detail + ")");
                } else {
                    if (!hasTokenInCookies())
                        setTokenInCookies(response.access_token);
                    message.success("Успешный вход!");
                    router.replace("/dashboard");
                }
            } catch (error) {
                message.error("Непредвиденная ошибка. Повторите попытку или попробуйте выполнить запрос позже.");
            }
        }, 1000);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ minWidth: 260, maxWidth: 360 }}
                onFinish={handleLogin}
            >
                <Form.Item>
                    <h2 style={{ margin: '0 auto', width: 'fit-content' }}>АППО - Вход в систему</h2>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Пожалуйста, введите вашу электронную почту!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Почта" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
                    style={{ marginTop: 10, marginBottom: 5 }}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
                </Form.Item>
                <Form.Item
                    style={{ marginTop: 5, marginBottom: 20 }}
                >
                    <Flex justify="space-between" align="center">
                        <a href="">Забыли пароль?</a>
                    </Flex>
                </Form.Item>
                <Form.Item style={{ marginTop: 10, marginBottom: 10 }}>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Войти
                    </Button>

                    <p style={{ marginTop: 10 }}>Нет аккаунта? <Link href={"/registration"}>Зарегистрироваться!</Link></p>
                </Form.Item>
            </Form>
        </div>
    );
}
