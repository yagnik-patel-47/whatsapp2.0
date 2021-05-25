import styled from "styled-components";
import Image from "next/image";
import PageTitle from "../components/PageTitle";
import { auth, provider } from "../firebase";

const Login = () => {
  const loginHandle = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <PageTitle title="Login" />
      <LoginContainer>
        <Image
          src="/transparent_logo.png"
          height={200}
          width={200}
          alt="App Logo"
        />
        <LoginButton onClick={loginHandle}>
          <BtnText>Login With Google</BtnText>
          <Logo>
            <Image
              src="/google_logo.png"
              width={30}
              height={30}
              alt="Google Logo"
            />
          </Logo>
        </LoginButton>
      </LoginContainer>
    </Container>
  );
};

const Logo = styled.div`
  background: #004aad;
  padding: 0.5rem;
  height: 100%;
`;

const BtnText = styled.div`
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-weight: 500;
  display: flex;
  background: transparent;
`;

const LoginButton = styled.button`
  border: 2px solid #004aad;
  display: flex;
  align-items: center;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  background: transparent;
`;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background: #fff;
  @media screen and (max-width: 768px) {
    padding: 0 2rem;
    height: 100%;
  }
`;

const LoginContainer = styled.div`
  height: 500px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: #f2f2f2;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 480px;
  }
`;

export default Login;
