import React from 'react'

const CodingLanguageCard = ({language,noOfUsers}) => {
  return (
    <div className="coding-language-card-cont">
      <h1>{language}</h1>
      <p>{noOfUsers}</p>
    </div>
  )
}

export default CodingLanguageCard
