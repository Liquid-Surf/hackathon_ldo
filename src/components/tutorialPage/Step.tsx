import React, { useRef } from 'react';
import { Card, CardContent, Typography, Grid, CardMedia } from '@mui/material';
import Slider from 'react-slick';

interface StepProps {
  title: string;
  description: string;
  images: string[];
}

const Step: React.FC<StepProps> = ({ title, description, images }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const sliderRef = useRef<any>(null); // Reference to the slider
  const goToNextSlide = () => {
    if (sliderRef && sliderRef.current) sliderRef.current.slickNext(); // Go to the next slide
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={6}>
          <Slider {...settings} ref={sliderRef}>
            {images.map((image, index) => (
              <div key={index} onClick={goToNextSlide}>
                <CardMedia
                  component="img"
                  image={image}
                  alt={`${title} Step ${index + 1}`}
                  sx={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Step;
