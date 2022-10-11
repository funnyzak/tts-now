import styled from '@emotion/styled'
import { appName } from '@/config'

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
  padding-top: 20px;
`

function Index() {
  return (
    <Header>
      {/* <img src="./icon/256x256.png" height="30px" css={css`margin-right:10px;`}/> */}
      {' '}
      {appName}
      {' '}
    </Header>
  )
}

export default Index
