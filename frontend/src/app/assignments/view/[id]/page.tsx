"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

import Header from "@/components/assignments/Header";
import api from "@/lib/axios";

type Question = {
  text: string;
  marks: number;
  difficulty: string;
};

type Section = {
  title: string;
  questionType: string;
  questions: Question[];
};

type Assignment = {
  _id: string;
  title: string;
  dueDate: string;
  instructions: string;
  status: string;
  createdAt: string;

  result: {
    assignmentMeta: {
      dueDate: string;
      totalSections: number;
      totalQuestions: number;
    };

    sections: Section[];
  };
};

export default function ViewAssignmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const res = await api.get(
        `/api/assignment/${id}`
      );

      setAssignment(res.data.assignment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!assignment) return;

    const pdf = new jsPDF();

    let y = 20;

    pdf.setFontSize(18);
    pdf.text(assignment.title, 20, y);

    y += 15;

    pdf.setFontSize(12);

    pdf.text(
      "Name: __________________________",
      20,
      y
    );

    y += 10;

    pdf.text(
      "Roll Number: ___________________",
      20,
      y
    );

    y += 10;

    pdf.text(
      "Section: _______________________",
      20,
      y
    );

    y += 10;

    pdf.text(
      "Total Time:",
      20,
      y
    );

    y += 20;

    assignment.result.sections.forEach(
      (section, sectionIndex) => {
        pdf.setFontSize(14);

        pdf.text(
          `Section ${String.fromCharCode(
            65 + sectionIndex
          )}`,
          20,
          y
        );

        y += 8;

        pdf.setFontSize(12);

        pdf.text(section.title, 20, y);

        y += 12;

        section.questions.forEach(
          (question, index) => {
            const lines = pdf.splitTextToSize(
              `${index + 1}. ${question.text}`,
              160
            );

            pdf.text(lines, 20, y);

            y += lines.length * 6;

            pdf.text(
              `[${question.marks} Marks]`,
              170,
              y - 5
            );

            y += 8;

            if (y > 260) {
              pdf.addPage();
              y = 20;
            }
          }
        );

        y += 12;
      }
    );

    pdf.save(
      `${assignment.title.replace(
        /\s+/g,
        "-"
      )}.pdf`
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "16px",
        }}
      >
        Loading Assignment...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "16px",
        }}
      >
        Assignment not found
      </div>
    );
  }

  return (
    <div
      className="bg-[#e7e7e7] w-full"
      style={{
        minHeight: "100vh",
        paddingTop: "10px",
      }}
    >
      <Header />

      {/* TOP BAR */}
      <div
        style={{
          margin: "10px",
          background: "#1A1A1A",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              color: "#fff",
              margin: 0,
              fontSize: "20px",
            }}
          >
            {assignment.title}
          </h2>

          <p
            style={{
              color: "#bbb",
              marginTop: "6px",
              marginBottom: 0,
              fontSize: "13px",
            }}
          >
            AI Generated Assignment
          </p>
        </div>

        <button
          onClick={downloadPDF}
          style={{
            background: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>

      {/* PAPER */}
      <div
        style={{
          margin: "10px",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #EAEAEA",
          overflow: "hidden",
        }}
      >
        {/* PAPER TITLE */}
        <div
          style={{
            padding: "30px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
            }}
          >
            {assignment.title}
          </h1>
        </div>

        {/* STUDENT INFO */}
        <div
          style={{
            padding: "24px 30px",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <strong>Name:</strong>
              <span
                style={{
                  display: "inline-block",
                  width: "250px",
                  borderBottom: "1px solid #333",
                  marginLeft: "10px",
                }}
              />
            </div>

            <div>
              <strong>Roll Number:</strong>
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  borderBottom: "1px solid #333",
                  marginLeft: "10px",
                }}
              />
            </div>

            <div>
              <strong>Section:</strong>
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  borderBottom: "1px solid #333",
                  marginLeft: "10px",
                }}
              />
            </div>

            <div>
              <strong>Total Time:</strong>
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  borderBottom: "1px solid #333",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "30px",
              flexWrap: "wrap",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <div>
              Total Sections:{" "}
              <strong>
                {
                  assignment.result.assignmentMeta
                    .totalSections
                }
              </strong>
            </div>

            <div>
              Total Questions:{" "}
              <strong>
                {
                  assignment.result.assignmentMeta
                    .totalQuestions
                }
              </strong>
            </div>

            <div>
              Due Date:
              <strong>
                {" "}
                {assignment.dueDate}
              </strong>
            </div>
          </div>
        </div>

        {/* QUESTIONS */}
        <div
          style={{
            padding: "30px",
          }}
        >
          {assignment.result.sections.map(
            (section, sectionIndex) => (
              <div
                key={sectionIndex}
                style={{
                  marginBottom: "40px",
                }}
              >
                <h2
                  style={{
                    marginBottom: "6px",
                  }}
                >
                  Section{" "}
                  {String.fromCharCode(
                    65 + sectionIndex
                  )}
                </h2>

                <p
                  style={{
                    color: "#666",
                    marginBottom: "20px",
                    fontWeight: 600,
                  }}
                >
                  {section.title}
                </p>

                {section.questions.map(
                  (question, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "20px",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            flex: 1,
                            whiteSpace:
                              "pre-line",
                            lineHeight: 1.8,
                            fontSize: "15px",
                          }}
                        >
                          <strong>
                            {index + 1}.
                          </strong>{" "}
                          {question.text}
                        </p>

                        <div
                          style={{
                            minWidth: "90px",
                            textAlign: "right",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          [{question.marks} Mark]
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#777",
                margin: 0,
              }}
            >
              — End of Question Paper —
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}