import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="wrapper">
          <div className="circle" />
          <div className="line-1" />
          <div className="line-2" />
          <div className="line-3" />
          <div className="line-4" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const gradientAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%; /* Cover a major part */
  max-width: 600px; /* Limit maximum width */
  z-index: 1000; /* Ensure it's on top */

  .loader {
    position: relative;
    width: 100%; /* Take full width of parent */
    height: 180px; /* Increased height */
    margin-bottom: 10px;
    border: 1px solid #d3d3d3;
    padding: 25px; /* Increased padding */
    background-color: white;
    overflow: hidden;
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.5); /* Shadow */
  }

  .loader:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      110deg,
      rgba(227, 227, 227, 0) 0%,
      rgba(227, 227, 227, 0) 40%,
      rgba(227, 227, 227, 0.5) 50%,
      rgba(227, 227, 227, 0) 60%,
      rgba(227, 227, 227, 0) 100%
    );
    animation: ${gradientAnimation} 1.2s linear infinite;
  }

  .loader .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .loader .wrapper > div {
    background-color: #9a9fee;
  }

  .loader .circle {
    width: 60px; /* Increased size */
    height: 60px; /* Increased size */
    border-radius: 50%;
  }

  .loader .line-1 {
    position: absolute;
    top: 20px; /* Adjusted position */
    left: 70px; /* Adjusted position */
    height: 12px; /* Adjusted size */
    width: 120px; /* Adjusted size */
  }

  .loader .line-2 {
    position: absolute;
    top: 50px; /* Adjusted position */
    left: 70px; /* Adjusted position */
    height: 12px; /* Adjusted size */
    width: 180px; /* Adjusted size */
  }

  .loader .line-3 {
    position: absolute;
    top: 80px; /* Adjusted position */
    left: 10px; /* Adjusted position */
    height: 12px; /* Adjusted size */
    width: 90%; /* Adjusted size */
  }

  .loader .line-4 {
    position: absolute;
    top: 110px; /* Adjusted position */
    left: 10px; /* Adjusted position */
    height: 12px; /* Adjusted size */
    width: 85%; /* Adjusted size */
  }
`;

export default Loader;