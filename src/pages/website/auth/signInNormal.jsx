import React from "react";

const SignIn = () => {
  const handleAfterSubmit = () => {
    setTimeout(() => {
      window.location.href = "/"; // بعد الحفظ، ينقلك للصفحة المطلوبة
    }, 1000);
  };

  return (
    <div className="auth-container px-2 lg:px-16">
      <form
        action="https://scc-global.net/orderSMM/api/auth"
        method="POST"
        autoComplete="on"
        onSubmit={handleAfterSubmit}
        className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3"
      >
        <h2 className="text-center">Sign In</h2>

        <div className="flex flex-col gap-1">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="dark-btn w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
