"use client";
import React, { useEffect, useState } from 'react';
import './ShimmerEffect.css'; // Add CSS file for shimmer effect
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Import the icon
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

const InternshipDetails = () => {
  const [internshipTitle, setInternshipTitle] = useState('');
  const [error, setError] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const internshipId = urlParams.get('id');

      if (!internshipId) {
        setInternshipTitle('Invalid internship ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/internship_overview/internship/${internshipId}`);
        const internship = await response.json();

        if (response.status !== 200) {
          setError('Error fetching internship details');
          setLoading(false);
          return;
        }

        // Set the internship title and banner image
        setInternshipTitle(internship.title);
        setBannerImg(internship.banner);
        setLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error('Error fetching internship details:', error);
        setError('Error fetching internship details');
        setLoading(false); // Stop loading on error
      }
    };

    fetchInternshipDetails();
  }, []); // Empty dependency array to run once on mount

  return (
    <div>
      <div className="roww marginr">
        <img
          src="img/internshipgrey.png"
          alt="internship icon"
          style={{ width: '14px', height: '14px', marginRight: '5px' }}
        />
        <a href="internshipsDashboard" style={{ textDecoration: 'none' }}>
          <p className="grey f14 marginr" style={{ margin: 0 }}>
            Internships
            <FontAwesomeIcon icon={faChevronRight} className="f10 marginl grey" size="2x" style={{marginRight:"10px"}}/>
          </p>
        </a>
        {!loading && (
          <p className="f14">{error || internshipTitle}</p>
        )}
      </div>

      <div className="banner">
        <div className="banner-text">
          {loading ? (
            <div className="shimmer shimmer-banner" style={{ width: '100%', height: '200px' }}></div>
          ) : (
            <img id="banner-img" src={bannerImg} alt="Internship Banner" />
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
