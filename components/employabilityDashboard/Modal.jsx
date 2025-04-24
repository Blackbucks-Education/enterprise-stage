import React from 'react';

const Modal = ({ closeModal, subDomain, students }) => {
    return (
        <div id="studentModal" className="modal" style={styles.modal}>
            <div className="modal-content" style={styles.modalContent}>
                <span onClick={closeModal} style={styles.close}>&times;</span>
                <h2 style={styles.title}>
                    Students with Accuracy Less Than or Equal to 80 in <span>{subDomain}</span>
                </h2>
                <table id="studentTable" style={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Coding Score</th>
                            <th>Employability Score</th>
                            <th>Employability Band</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.coding || 'Not Attempted'}</td>
                                <td>{student.total_score || 'Not Attempted'}</td>
                                <td>{student.employability_band}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    modal: {
        display: 'block',
        position: 'fixed',
        zIndex: 1,
        paddingTop: '60px',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgb(0,0,0)',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#fefefe',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
    },
    close: {
        color: '#aaa',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor:'pointer',
    },
    title: {
        fontSize: '16px',
    },
    table: {
        width: '100%',
        textAlign: 'center',
    },
};

export default Modal;
