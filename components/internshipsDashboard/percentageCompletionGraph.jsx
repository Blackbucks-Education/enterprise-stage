"use client";
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

const InternshipOverview = () => {
  const [internshipId, setInternshipId] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("id");
      setInternshipId(id);
    }
  }, []);

  useEffect(() => {
    if (internshipId) {
      // Fetch data from the API
      setIsLoading(true); // Set loading to true before fetch
      fetch(`/api/internship_overview/graph_details/${internshipId}`)
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false); // Set loading to false after fetch

          if (data.message === "Data not found") {
            setNoDataMessage("No data available");
            return;
          }

          const originalTotalData = [
            data[0].total_live_sessions,
            data[0].total_assessments,
            data[0].grand_tests,
            data[0].assignments,
          ];
          const completedData = [
            data[0].total_event_count,
            data[0].daily_tests,
            data[0].grand_tests,
            data[0].assignments,
          ];
          const totalData = originalTotalData.map(
            (value, index) => value - completedData[index]
          );

          setChartData({ originalTotalData, completedData, totalData });
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false); // Set loading to false in case of an error
        });
    }
  }, [internshipId]);

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById("myChart").getContext("2d");

      // Creating a pattern with vertical lines for filled bars
      function getPattern() {
        const patternCanvas = document.createElement("canvas");
        const patternContext = patternCanvas.getContext("2d");

        patternCanvas.width = 40;
        patternCanvas.height = 400;

        // Create grey vertical lines for filled bars
        patternContext.fillStyle = "rgba(230, 229, 251, 1)"; // Grey color
        for (let i = 0; i < 40; i += 4) {
          // Adjust width of the stripes to 4 pixels
          patternContext.fillRect(i, 0, 2, 400); // Draw vertical lines
        }

        return ctx.createPattern(patternCanvas, "repeat");
      }

      function createLinearGradient(ctx, bottomColor) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Create a vertical gradient
        gradient.addColorStop(0, "rgba(211, 251, 82, 0.1)");
        gradient.addColorStop(0.5, "rgba(211, 251, 82, 0.8)"); // Lighter shade of #D3FB52
        gradient.addColorStop(1, "rgba(211, 251, 82, 1)"); // Darker shade of #D3FB52

        return gradient;
      }

      const linearGradient = createLinearGradient(ctx, "#D3FB52"); // Color at the bottom

      const config = {
        type: "bar",
        data: {
          labels: [
            "Live Sessions",
            "Daily Tests",
            "Weekly Tests",
            "Grand Tests",
          ],
          datasets: [
            {
              label: "Completed",
              borderRadius: {
                topLeft: 5,
                topRight: 5,
                bottomLeft: 20,
                bottomRight: 20,
              },
              backgroundColor: linearGradient, // Apply gradient
              data: chartData.completedData,
              barThickness: 35,
            },
            {
              label: "Total",
              borderRadius: 5,
              backgroundColor: getPattern(), // Apply pattern to the empty bars
              data: chartData.totalData,
              barThickness: 35,
            },
          ],
        },
        options: {
          layout: {
            padding: {
              bottom: 20, // Adjust the bottom padding
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false, // Remove grid lines on x-axis
              },
            },
            y: {
              ticks: {
                stepSize: 10,
                min: 0,
              },
              stacked: true,
              grid: {
                display: false, // Remove background graph lines
              },
            },
          },
        },
      };

      // Create the chart
      new Chart(ctx, config);
    }
  }, [chartData]);

  return (
    <div className="section2_1_2">
      <div style={{ width: "400px", height: "200px" }}>
        {isLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              margin: "20px",
            }}
          ></div>
        ) : noDataMessage ? (
          <div
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              margin: "20px",
            }}
          >
            {/* No text shown when there's no data */}
          </div>
        ) : (
          <>
            <p className="f16 font600">% Completion</p>
            <canvas id="myChart" width="400" height="200"></canvas>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipOverview;
