import "./SliderArrow.module.css";

function SliderArrow(props) {
  const { className, onClick } = props;
  return <div className={`${className} slider-arrow`} onClick={onClick} />;
}

export default SliderArrow;
