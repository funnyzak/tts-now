import styled from 'styled-components';
import { voiceTypeList } from '@/config';
import useAppSetting from '@/hook/appHook';

const Wrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const Index = () => {
  const { appSetting } = useAppSetting();
  return (
    <Wrapper>
      <img src={voiceTypeList[appSetting.voiceSetIndex].img} />
      <div>
        <div>
          {voiceTypeList[appSetting.voiceSetIndex].speaker}
          {' '}
        </div>
        <div>{voiceTypeList[appSetting.voiceSetIndex].speechType}</div>
      </div>
    </Wrapper>
  );
};

export default Index;
