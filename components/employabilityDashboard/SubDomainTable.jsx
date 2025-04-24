"use client";
import React, { useState, useEffect } from 'react';
import ShimmerTable from './ShimmerTable'; // Ensure to adjust the import path as necessary

const SubDomainTable = ({ currentData, isShowingAll, rowsToShow, fetchStudents, handleToggleRows }) => {
    const [loading, setLoading] = useState(true);

    // Simulate data fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); // Stop loading after a set time
        }, 2000); // Adjust time as needed (2 seconds for example)

        return () => clearTimeout(timer);
    }, []);

    // Prepare rows to show
    const rows = isShowingAll ? currentData : currentData.slice(0, rowsToShow);

    return (
        <>
            {loading ? (
                <ShimmerTable rows='5' cols="2"/>
            ) : (
                <table className="section5_table" id="subDomainTable">
                    <thead>
                        <tr>
                            <th>Sub Domain</th>
                            <th>No. of Students to Improve In</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.sub_domain}</td>
                                <td>
                                    <a href="#" onClick={() => fetchStudents(row.sub_domain)}>
                                        {row.count_of_students}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {currentData.length > rowsToShow && !loading && (
                <button id="toggleRowsBtn" onClick={handleToggleRows} style={styles.toggleButton}>
                    {isShowingAll ? 'Show Less' : 'Show More'}
                </button>
            )}
        </>
    );
};

const styles = {
    toggleButton: {
        display: 'block',
        border: 'none',
        backgroundColor: 'transparent',
        margin: '10px',
        color: '#3468b5',
        fontSize: '12px',
        textDecoration: 'underline',
        float: 'right',
    },
};

export default SubDomainTable;
