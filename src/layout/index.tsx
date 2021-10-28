import styled from '@emotion/styled';
import AppMain from './AppMain';
import SiderBar from './SiderBar';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const Index = () => (
  <Wrapper>
    <SiderBar />
    <AppMain />
  </Wrapper>
);

export default Index;
