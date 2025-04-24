import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './CompletionTracker.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, ChartDataLabels);

const CompletionTracker = ({ selectedAssessments }) => {
    const [trackerData1, setTrackerData1] = useState([]);
    const [trackerData2, setTrackerData2] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [isDataFetched, setIsDataFetched] = useState(false);

    // Constant placeholder data to use when real data is missing
    const placeholderData = [
        { language: 'JavaScript', accuracy: 70 },
        { language: 'Python', accuracy: 80 },
        { language: 'Java', accuracy: 75 },
    ];

    useEffect(() => {
        if (selectedAssessments && selectedAssessments.length === 2) {
            const [assessment1, assessment2] = selectedAssessments;
            if (assessment1 && assessment2) {
                fetchCombinedData(assessment1.value, setTrackerData1);
                fetchCombinedData(assessment2.value, setTrackerData2);
            }
        }
    }, [selectedAssessments]);

    useEffect(() => {
        // Use placeholder data if no real data is available
        if (!isDataFetched) {
            setTrackerData1(placeholderData);
            setTrackerData2(placeholderData);
        }

        // Set filtered languages for both assessments
        if (trackerData1.length > 0 && trackerData2.length > 0) {
            const languages1 = trackerData1.map(item => item.language);
            const languages2 = trackerData2.map(item => item.language);
            const uniqueLanguages = Array.from(new Set([...languages1, ...languages2]));
            setFilteredLanguages(uniqueLanguages);
            setSelectedLanguage(uniqueLanguages[0]);
        }
    }, [trackerData1, trackerData2, isDataFetched]);

    const fetchCombinedData = async (hackathonId, setTrackerData) => {
        try {
            const accuracyResponse = await axios.get(`/api/compare/accuracy_scores?hackathon_id=${hackathonId}`);
            const accuracyData = accuracyResponse.data;

            const combinedData = accuracyData.map(accItem => ({
                language: accItem.language,
                accuracy: accItem.accuracy_percentage,
            }));

            setTrackerData(combinedData);
            setIsDataFetched(true); // Mark data as fetched
        } catch (error) {
            console.error('Error fetching accuracy data:', error);
            setIsDataFetched(false); // Ensure it falls back to dummy data in case of error
        }
    };

    const handleLanguageFilterChange = (language) => {
        setSelectedLanguage(language);
    };

    const filteredData1 = trackerData1.filter(item => item.language === selectedLanguage);
    const filteredData2 = trackerData2.filter(item => item.language === selectedLanguage);

    const chartData = {
        labels: [selectedAssessments[0]?.label || 'Assessment 1', selectedAssessments[1]?.label || 'Assessment 2'],
        datasets: [{
            label: selectedLanguage,
            data: [
                filteredData1[0]?.accuracy || placeholderData.find(p => p.language === selectedLanguage)?.accuracy || 0,
                filteredData2[0]?.accuracy || placeholderData.find(p => p.language === selectedLanguage)?.accuracy || 0
            ],
            backgroundColor: '#d3fb52',
            borderColor: '#a1c900',
            borderWidth: 2,
            borderRadius: 20,
            barThickness: 40,
        }],
    };

    const chartOptions = {
        layout: {
            padding: {
                top: 40,
                bottom: 20
            }
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Assessments',
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            datalabels: {
                display: true,
                color: '#000',
                anchor: 'end',
                align: 'top',
                offset: 10,
                formatter: function (value) {
                    return value + '%';
                },
                clamp: true,
                padding: {
                    top: 10
                }
            }
        },
    };

    return (
        <div className="new-completion-tracker-container">
            <div className="new-completion-tracker-chart">
                <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="new-completion-tracker-filters">
                {filteredLanguages.map(language => (
                    <div
                        key={language}
                        className={`new-filter-card ${selectedLanguage === language ? 'new-active' : ''}`}
                        onClick={() => handleLanguageFilterChange(language)}
                    >
                        {language}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletionTracker;
