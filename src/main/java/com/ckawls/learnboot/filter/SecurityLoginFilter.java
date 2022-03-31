package com.ckawls.learnboot.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class SecurityLoginFilter extends UsernamePasswordAuthenticationFilter {

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        // 非post的登录请求直接报错
        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }

        // 验证码信息
        //String verifyCode = (String) request.getSession().getAttribute("verify_code");
        if (request.getContentType().equals(MediaType.APPLICATION_JSON_VALUE)
                || request.getContentType().equals(MediaType.APPLICATION_JSON_UTF8_VALUE)) {
            HashMap<String, String> loginData = new HashMap<>();
            try {
                loginData = (HashMap<String, String>) new ObjectMapper().readValue(request.getInputStream(), Map.class);
            } catch (IOException e) {
            } finally {
                String code = loginData.get("code");
                //CheckCode(response, code, verifyCode);
            }

            String username = loginData.get("username");
            String password = loginData.get("password");

            if (username == null) {
                username = "";
            }
            if (password == null) {
                password = "";
            }
            username.trim();
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            setDetails(request, authenticationToken);
            return this.getAuthenticationManager().authenticate(authenticationToken);
        }else{
            //CheckCode(response, request.getParameter("code"), verifyCode);
            return super.attemptAuthentication(request, response);
        }
    }

    

    private static void CheckCode(HttpServletResponse rep, String code, String verifyCode) {
        if (code == null || verifyCode == null || "".equals(code) || "".equals(verifyCode)
                || !(code.toLowerCase().equals(verifyCode.toLowerCase()))) {
            throw new AuthenticationServiceException("verify code is  not correct");
        }
    }

}
