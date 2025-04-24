"use client";

import React, { useState, useEffect } from 'react';
import SubDomainTable from './SubDomainTable';
import CylindricalChart from './CylindricalChart';
import Modal from './Modal';

const TechnicalSectionAnalysis = () => {
    const [currentData, setCurrentData] = useState([]);
    const [isShowingAll, setIsShowingAll] = useState(false);
    const [selectedSubDomain, setSelectedSubDomain] = useState(null);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const rowsToShow = 6;

    useEffect(() => {
        const fetchSubDomainCounts = async () => {
            try {
                const response = await fetch('api/emp_accuracy_below_50/student-counts');
                const data = await response.json();
                setCurrentData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchSubDomainCounts();
    }, []);

    const handleToggleRows = () => {
        setIsShowingAll(!isShowingAll);
    };

    const fetchStudents = async (subDomain) => {
        const response = await fetch(`/api/emp_accuracy_below_50/students/${subDomain}`);
        const data = await response.json();
        setStudents(data);
        setSelectedSubDomain(subDomain);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Inline styles for the shimmer effect
    const shimmerStyles = {
        container: {
            padding: '20px',
        },
        header: {
            height: '30px',
            marginBottom: '15px',
            background: 'linear-gradient(90deg, #ececec 25%, #f8f8f8 50%, #ececec 75%)',
            borderRadius: '5px',
            animation: 'loading 1.5s infinite',
        },
        chart: {
            height: '200px',
            background: 'linear-gradient(90deg, #ececec 25%, #f8f8f8 50%, #ececec 75%)',
            borderRadius: '5px',
            animation: 'loading 1.5s infinite',
            marginBottom: '15px',
        },
        table: {
            borderRadius: '5px',
            overflow: 'hidden',
        },
        row: {
            height: '20px',
            marginBottom: '10px',
            background: 'linear-gradient(90deg, #ececec 25%, #f8f8f8 50%, #ececec 75%)',
            animation: 'loading 1.5s infinite',
        },
    };

    // Keyframes for the shimmer animation
    const keyframes = `
        @keyframes loading {
            0% {
                background-position: -200px 0;
            }
            100% {
                background-position: 200px 0;
            }
        }
    `;

    return (
        <div className="section5" id="technical-section-analysis" style={{ gap: "15px" }}>
            <style>{keyframes}</style> {/* Inject keyframes for shimmer animation */}

            {loading ? ( // Show shimmer UI while loading
                <div style={shimmerStyles.container}>
                    <div style={shimmerStyles.header} />
                    <div style={shimmerStyles.chart} />
                    <div style={shimmerStyles.table}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} style={shimmerStyles.row} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="row">
                        <h3>Technical Section Analysis</h3>
                        <i className="fa-solid fa-chevron-up"></i>
                    </div>
                    <p style={{ fontWeight: 'normal' }}>
                        This section provides a comprehensive analysis of the entire batch, highlighting strengths and
                        weaknesses. Gain insights into individual student needs and personalize their learning paths.
                    </p>
                    <div className="section5_data">
                        <div style={{ width: "50%" }} className="section5_1">
                            <p style={{ marginBottom: "13px" }}>Technical Section</p>
                            <CylindricalChart />
                        </div>

                        <div className="section5_2" style={{ width: "45%" }}>
                            <p>Analysis of Coding Subdomains: Student Scores ≤ 80</p>
                            <SubDomainTable
                                currentData={currentData}
                                isShowingAll={isShowingAll}
                                rowsToShow={rowsToShow}
                                fetchStudents={fetchStudents}
                                handleToggleRows={handleToggleRows}
                            />
                        </div>
                    </div>
                    {isModalOpen && (
                        <Modal
                            closeModal={closeModal}
                            subDomain={selectedSubDomain}
                            students={students}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TechnicalSectionAnalysis;
