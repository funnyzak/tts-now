import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { voiceTypeList } from '@/config';
import useAppSetting from '@/hook/appHook';

const Wrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  display: flex;
`;

const Index = () => {
  const { appSetting } = useAppSetting();
  return (
    <Wrapper>
      <img
        css={{
          width: '80px',
          height: 'auto',
          marginRight: '20px'
        }}
        src={voiceTypeList[appSetting.voiceSetIndex].img}
      />
      <div>
        <div
          css={css`
            margin-top: 20px;
            font-size: 13.5px;
            color: #000;
          `}
        >
          {voiceTypeList[appSetting.voiceSetIndex].speaker}
        </div>
        <div
          css={css`
            font-size: 13px;
            margin-top: 5px;
            color: #666;
          `}
        >
          {voiceTypeList[appSetting.voiceSetIndex].speechType}
        </div>
      </div>
    </Wrapper>
  );
};

export default Index;
