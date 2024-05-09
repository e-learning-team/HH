import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


export default function SkeletonCard() {
    return (
        <Box className="" sx={{ overflow: 'hidden' }}>
            <Grid container wrap="nowrap">
                <Box sx={{  marginRight: 0.5, my: 5 }}>
                    <Skeleton variant="rectangular" height={118} />
                    <Box sx={{ minWidth:230, pt: 0.5 }}>
                        <Skeleton />
                        <Skeleton width="60%" />
                    </Box>
                </Box>
            </Grid>
        </Box>
    );
}