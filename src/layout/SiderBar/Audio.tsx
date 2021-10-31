import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Slider, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import useAppSetting from '@/hook/appHook';
import { uiConfig } from '@/config';

interface RadioGroupInterface {
  options: Array<any>;
  value: string;
  name: string;
  title: string;
}

const RadioGroupComponent: React.FC<RadioGroupInterface> = (
  props: RadioGroupInterface
) => {
  const {
    options, value, name, title
  } = props;

  const [val, setVal] = useState(value);
  const { appSetting, setAppSetting } = useAppSetting();

  const changeValue = (e: any) => {
    setVal(e.target.value);
  };

  useEffect(() => {
    appSetting.ttsSetting[name] = val;
    setAppSetting(appSetting);
  }, [val]);

  return (
    <div
      css={css`
        margin-bottom: 30px;
      `}
    >
      <div css={{ textAlign: 'left', marginBottom: '10px' }}>{title}</div>
      <div>
        <Radio.Group value={val} onChange={changeValue}>
          {options.map((v) => (
            <Radio key={v.value} value={v.value.toString()}>
              {v.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

interface SilderInterface {
  value: number;
  name: string;
  title: string;
  min: number;
  max: number;
}

const SliderComponent: React.FC<SilderInterface> = (props: SilderInterface) => {
  const {
    value, name, title, max, min
  } = props;
  const [val, setVal] = useState(value);
  const { appSetting, setAppSetting } = useAppSetting();

  const formatter = (_value) => `${_value}%`;

  const changeValue = (_value: number) => {
    setVal(_value);
  };

  useEffect(() => {
    appSetting.ttsSetting[name] = val;
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
        min={min}
        max={max}
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
          value={appSetting.ttsSetting.speedRate}
          name="ttsSpeed"
          min={-500}
          max={500}
          title="语速"
        />
        <SliderComponent
          value={appSetting.ttsSetting.pitchRate}
          name="ttsTone"
          min={-500}
          max={500}
          title="语调"
        />
        <SliderComponent
          value={appSetting.ttsSetting.volumn}
          name="ttsVolumn"
          min={0}
          max={100}
          title="音量"
        />
      </div>
      <div css={{ marginTop: '30px' }}>
        <RadioGroupComponent
          value={appSetting.ttsSetting.simpleRate.toString()}
          name="samplingRate"
          title="采样率"
          options={uiConfig.samplingRateList}
        />
        <RadioGroupComponent
          value={appSetting.ttsSetting.format}
          name="outputFormat"
          title="导出格式"
          options={uiConfig.outputFormatList}
        />
      </div>
    </Wrapper>
  );
};

export default Index;
