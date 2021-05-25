import styled from "styled-components";
import PageTitle from "../components/PageTitle";
import CachedIcon from "@material-ui/icons/Cached";

export default () => {
  const reloadHandle = () => {
    location.reload();
  };

  return (
    <Container>
      <PageTitle title="Offline" />
      <OfflineContainer>
        <h3>You are currently Offline!</h3>
        <p>
          Please make sure that you have a stable internet connection and if you
          have click below button.
        </p>
        <ReloadButton onClick={reloadHandle}>
          <BtnText>Reload</BtnText>
          <Logo>
            <CachedIcon style={{ color: "#f9f9f9" }} />
          </Logo>
        </ReloadButton>
      </OfflineContainer>
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

const ReloadButton = styled.button`
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

const OfflineContainer = styled.div`
  height: 500px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: #f2f2f2;
  padding: 1rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 480px;
  }
`;
