import React, {useRef} from 'react';
import { Typography, Chip, Stack, Grid, CardMedia } from '@mui/material';
import Slider from 'react-slick';

interface IntroProps {
    title: string;
    author: string;
    date: string;
    description: string;
    descriptionLong: string;
    tags: string[];
    images: string[];
}

const Intro: React.FC<IntroProps> = ({ title, author, date, tags, images, description, descriptionLong }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const sliderRef = useRef<any>(null);  // Reference to the slider
    const goToNextSlide = () => {
      if ( sliderRef && sliderRef.current)
        sliderRef.current.slickNext();  // Go to the next slide
    };
    const handleTagClick = (tag: string) => {
        // navigate(`/search?tag=${encodeURIComponent(tag)}`);
        console.log('clicked on ' + tag);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1">{title}</Typography>
                <Typography variant="subtitle1" component="p">{`By ${author} on ${date}`}</Typography>
                <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                    {tags.map((tag, index) => (
                        <Chip 
                        	key={index} 
                          label={tag} 
                          onClick={() => handleTagClick(tag)}
                          sx={{ cursor: 'pointer' }}
                          />
                    ))}
                </Stack>
                <Typography variant="subtitle2" component="p" sx={{ my: 1 }}>{description}</Typography>
                <Typography variant="body1">{descriptionLong}</Typography>
            </Grid>
            {images && images.length > 0 && (
                <Grid item xs={12} md={4}>
                    <Slider {...settings} ref={sliderRef}>
                        {images.map((image, index) => (
                            <div key={index} onClick={goToNextSlide} >
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`${title} Image ${index + 1}`}
                                    sx={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </Slider>
                </Grid>
            )}
        </Grid>
    );
};

export default Intro;
