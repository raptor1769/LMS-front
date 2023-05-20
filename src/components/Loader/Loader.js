import "./Loader.scss";

const Loader = () => {
  return (
    <div className='loader-container'>
      <div className='lds-facebook'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
