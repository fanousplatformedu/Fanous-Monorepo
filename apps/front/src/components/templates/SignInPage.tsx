import AnimatedBackground from "@ui/AnimatedBackground";
import AuthCard from "@modules/Auth/AuthCard";

const SignInPage = () => {
  return (
    <div className="relative min-h-screen grid place-items-center overflow-hidden">
      <AnimatedBackground />
      <AuthCard />
    </div>
  );
};

export default SignInPage;
