import styled from '@emotion/styled';
import { appName } from '@/config/app';

const Header = styled.div`
  width: 280px;
  height: 80px;
  background-color: #748bad;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 24px;
  color: #fff;
`;

const Index = () => (
  <Header>
    {' '}
    {appName}
    {' '}
  </Header>
);

export default Index;
