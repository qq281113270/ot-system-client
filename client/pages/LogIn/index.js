import "client/assets/css/base.less";
import "./index.less";

import { Button, Paper, TextField } from "@mui/material";
import { message } from "antd";
import { login } from "client/assets/js/request/index";
import FormItem from "client/component/FormItem";
import VerificationCode from "client/component/VerificationCode";
import { mapRedux } from "client/redux";
import { addRouterApi } from "client/router";
import { checkEmail, checkPassword, checkPhone, checkUser } from "client/utils";
import { createForm } from "rc-form";
import React, { useEffect } from "react";

const Index = (props) => {
  const { pushRoute, routePaths, form } = props;
  const { validateFields } = form;

  const onFinish = async (values) => {
    const {
      dispatch: {
        user: { setUserInfo }
      }
    } = props;

    const { data } = await login(values);

    const { token } = data;

    localStorage.setItem("token", token);

    setUserInfo(data);

    message.success("登录成功");
    setTimeout(() => {
      pushRoute(routePaths.home);
    }, 1500);
  };

  const onSubmit = async () => {
    validateFields((error, values) => {
      if (!error) {
        onFinish(values);
      } else {
        console.error(error);
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="log-in">
      <div className="content center">
        <Paper elevation={3} className="paper">
          <h3>《OT协同办公系统》 </h3>

          <FormItem
            className="margin-top-10"
            rules={[
              {
                required: true,
                message: "请输入用户名或手机号或邮箱"
              },
              {
                validator: (rule, value) => {
                  if (
                    checkUser(value) ||
                    checkPhone(value) ||
                    checkEmail(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject("格式不正确请重新输入");
                }
              }
            ]}
            label="用户名/手机号/邮箱"
            form={form}
            name="name">
            <TextField
              className="input-w"
              required
              placeholder="请输入用户名/手机号/邮箱"
              variant="outlined"
            />
          </FormItem>

          <FormItem
            label="密码"
            name="password"
            className="margin-top-10"
            rules={[
              {
                required: true,
                message: "请输入密码"
              },
              {
                validator: (rule, value) => {
                  if (!checkPassword(value)) {
                    return Promise.reject(
                      "密码最少为8位，并且最少含有字母和数字组成"
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
            form={form}>
            <TextField
              className="input-w"
              required
              placeholder="请输入密码"
              variant="outlined"
              type="password"
              autoComplete="current-password"
            />
          </FormItem>

          {/*验证码*/}
          <VerificationCode form={form} />
          <div className="buttons">
            <Button
              className="submit"
              variant="contained"
              onClick={() => {
                onSubmit();
              }}>
              登录
            </Button>

            <Button
              variant="outlined"
              className="submit"
              onClick={() => {
                pushRoute(routePaths.register);
              }}>
              注册
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default mapRedux()(
  addRouterApi(
    createForm({
      name: "LogIn"
    })(Index)
  )
);
