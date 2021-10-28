import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Slider, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import useAppSetting from '@/hook/appHook';
import { uiConfig } from '@/config';

const CheckboxGroup = Checkbox.Group;

interface CheckBoxInterface {
  options: Array<any>;
  value: Array<any>;
  name: string;
  title: string;
}

const CheckComponent: React.FC<CheckBoxInterface> = (
  props: CheckBoxInterface
) => {
  const {
    options, value, name, title
  } = props;

  const [checkboxOptions] = useState(options);
  const [val, setVal] = useState(value);
  const { appSetting, setAppSetting } = useAppSetting();

  const changeValue = (_value: Array<any>) => {
    setVal(_value);
  };

  useEffect(() => {
    appSetting[name] = val;
    setAppSetting(appSetting);
  }, [val]);

  return (
    <div
      css={css`
        margin-bottom: 20px;
      `}
    >
      <div css={{ textAlign: 'left', marginBottom: '10px' }}>{title}</div>
      <div>
        <CheckboxGroup
          options={checkboxOptions}
          value={val}
          onChange={changeValue}
        />
      </div>
    </div>
  );
};

interface SilderInterface {
  value: number;
  name: string;
  title: string;
}

const SliderComponent: React.FC<SilderInterface> = (props: SilderInterface) => {
  const { value, name, title } = props;
  const [val, setVal] = useState(value);
  const { appSetting, setAppSetting } = useAppSetting();

  const formatter = (_value) => `${_value}%`;

  const changeValue = (_value: number) => {
    setVal(_value);
  };

  useEffect(() => {
    appSetting[name] = val;
    setAppSetting(appSetting);
  }, [val]);

  return (
    <div
      css={css`
        width: 100%;
        margin-top: 15px;
      `}
    >
      <div
        css={css`
          width: 100%;
          text-align: center;
          font-size: 12px;
        `}
      >
        {title}
      </div>
      <Slider
        tipFormatter={formatter}
        value={val}
        disabled={false}
        min={10}
        onChange={changeValue}
      />
      <div
        css={css`
          width: 100%;
          text-align: right;
        `}
      >
        {value}
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Index = () => {
  const { appSetting } = useAppSetting();
  return (
    <Wrapper>
      <div css={{ paddingBottom: '30px', borderBottom: '1px solid #f2f9f2' }}>
        <SliderComponent
          value={appSetting.ttsSpeed}
          name="ttsSpeed"
          title="语速"
        />
        <SliderComponent
          value={appSetting.ttsTone}
          name="ttsTone"
          title="语调"
        />
        <SliderComponent
          value={appSetting.ttsVolumn}
          name="ttsVolumn"
          title="音量"
        />
      </div>
      <div css={{ marginTop: '40px' }}>
        <CheckComponent
          value={appSetting.samplingRate}
          name="samplingRate"
          title="采样率"
          options={uiConfig.samplingRateList}
        />
        <CheckComponent
          value={appSetting.outputFormat}
          name="outputFormat"
          title="导出格式"
          options={uiConfig.outputFormatList}
        />
      </div>
    </Wrapper>
  );
};

export default Index;
