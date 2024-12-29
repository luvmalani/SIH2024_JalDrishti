import { Carousel } from "@material-tailwind/react";
import img1 from "../components/images/re8.jpg"; // Make sure file path and extension are correct
import img2 from "../components/images/re9.jpg"; 
import img3 from "../components/images/re7.jpg";
const CarouselDefault =() => {
  return (
    <>
    <Carousel className="rounded-xl">
      <img
        src={img1}
        alt="image 1"
        className="h-full w-full object-cover"
      />
      <img
        src={img2}
        alt="image 2"
        className="h-full w-full object-cover"
      />
      <img
        src={img3}
        alt="image 3"
        className="h-full w-full object-cover"
      />
    </Carousel>
     
   </>
  );
}

export default CarouselDefault; // Ensure this default export exists
