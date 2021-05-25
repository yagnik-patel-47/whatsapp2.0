import Image from "next/image";
import styled, { keyframes } from "styled-components";
import PageTitle from "../components/PageTitle";

const Loading = () => {
  return (
    <Container>
      <PageTitle title="Loading..." />
      <Image
        src="/transparent_logo.png"
        width={200}
        height={200}
        alt="App Logo"
      />
      <Loader></Loader>
    </Container>
  );
};

const LoaderAnim = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

const Loader = styled.div`
  border: 8px solid #d0d0d0;
  border-top: 8px solid #3cbc28;
  width: 3rem;
  height: 3rem;
  animation: ${LoaderAnim} 2s ease-in-out infinite;
  border-radius: 50%;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
  @media screen and (max-width: 768px) {
    height: 100%;
  }
`;

export default Loading;
