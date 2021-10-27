import txtExample from './assets/source/example.txt';
import hbsExample from './assets/source/example.hbs';

const Index = () => (
  <div>

    <div>
      NODE_ENV:
      {process.env.NODE_ENV}
    </div>
    <div>{txtExample}</div>
    <div dangerouslySetInnerHTML={{ __html: hbsExample }} />
  </div>
);

export default Index
