import { useState, useEffect } from 'react';
import { db } from '../firebase/config.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    if (!selectedCustomer) {
      setVisits([]);
      return;
    }

    const fetchVisits = async () => {
      try {
        const visitsColRef = collection(
          db,
          'customers',
          selectedCustomer.id,
          'visits'
        );
        const q = query(visitsColRef, orderBy('timestamp', 'desc'));
        const visitsSnapshot = await getDocs(q);
        const visitsData = visitsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVisits(visitsData);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchVisits();
  }, [selectedCustomer]);

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phone', '==', searchQuery));
    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <p>Search for customers by phone number.</p>
          <div>
            <input
              type="text"
              placeholder="Enter exact phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <hr style={{ margin: '20px 0' }} />
          <div>
            <h3>Search Results</h3>
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    style={{ cursor: 'pointer', padding: '5px' }}
                  >
                    {customer.name} - {customer.phone}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No customers found.</p>
            )}
          </div>
        </div>
        <div
          style={{ flex: 2, borderLeft: '1px solid #eee', paddingLeft: '40px' }}
        >
          <h3>Customer Details</h3>
          {selectedCustomer ? (
            <div>
              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>
              {/* 이 부분이 수정되었습니다. */}
              <p>
                <strong>Phone:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email || 'N/A'}
              </p>
              <p>
                <strong>Stamps:</strong> {selectedCustomer.stamps}
              </p>
              <p>
                <strong>First Visit:</strong>{' '}
                {new Date(
                  selectedCustomer.createdAt.seconds * 1000
                ).toLocaleString()}
              </p>
              <hr style={{ margin: '20px 0' }} />
              <h4>Visit History ({visits.length} visits)</h4>
              {visits.length > 0 ? (
                <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {visits.map((visit) => (
                    <li key={visit.id}>
                      {new Date(
                        visit.timestamp.seconds * 1000
                      ).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No visit history found.</p>
              )}
            </div>
          ) : (
            <p>Select a customer from the search results to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
