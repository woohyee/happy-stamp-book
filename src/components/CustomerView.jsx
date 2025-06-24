import { useState, useEffect } from 'react';
import { db } from '../firebase/config.js';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';

function CustomerView() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [existingCustomer, setExistingCustomer] = useState(null);

  const handlePhoneChange = (e) => {
    const rawPhone = e.target.value.replace(/\D/g, '');
    const phoneLength = rawPhone.length;
    let formattedPhone = '';
    if (phoneLength < 4) {
      formattedPhone = rawPhone;
    } else if (phoneLength < 7) {
      formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(3)}`;
    } else {
      formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(
        3,
        6
      )}-${rawPhone.slice(6, 10)}`;
    }
    setPhone(formattedPhone);
  };

  useEffect(() => {
    if (phone.length === 12) {
      const searchForCustomer = async () => {
        const customersRef = collection(db, 'customers');
        const q = query(customersRef, where('phone', '==', phone));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setExistingCustomer(null);
        } else {
          const customerDoc = querySnapshot.docs[0];
          setExistingCustomer({ id: customerDoc.id, ...customerDoc.data() });
        }
      };
      searchForCustomer();
    } else {
      setExistingCustomer(null);
    }
  }, [phone]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, 'customers'), {
        name,
        phone,
        email,
        stamps: 0,
        createdAt: new Date(),
      });
      alert('Registration successful! Welcome!');
      setName('');
      setPhone('');
      setEmail('');
    } catch (e) {
      console.error('Error during registration: ', e);
      alert('An error occurred during registration.');
    }
  };

  // [디버깅 모드] 스탬프 적립 함수
  const handleAddStamp = async () => {
    console.log('--- Add Stamp Process START ---');
    if (!existingCustomer || !existingCustomer.id) {
      console.error('STOP: No selected customer.');
      return;
    }

    console.log('1. Customer ID:', existingCustomer.id);
    const customerDocRef = doc(db, 'customers', existingCustomer.id);
    const visitsColRef = collection(customerDocRef, 'visits');
    console.log('2. References created successfully.');

    try {
      console.log('3. Trying to update stamp count...');
      await updateDoc(customerDocRef, {
        stamps: increment(1),
      });
      console.log('4. Stamp count update SUCCEEDED.');

      console.log('5. Trying to add visit document...');
      await addDoc(visitsColRef, {
        timestamp: new Date(),
      });
      console.log('6. Visit document add SUCCEEDED.');

      setExistingCustomer((prev) => ({ ...prev, stamps: prev.stamps + 1 }));
      alert('Stamp added successfully!');
    } catch (e) {
      console.error('7. CRITICAL ERROR in try block:', e);
      alert('Failed to add stamp. Check the console for errors.');
    }
    console.log('--- Add Stamp Process END ---');
  };

  if (existingCustomer) {
    return (
      <div>
        <h2>Welcome back, {existingCustomer.name}!</h2>
        <p>Current Stamps: {existingCustomer.stamps}</p>
        <button onClick={handleAddStamp}>Add 1 Stamp</button>
        <button onClick={() => setExistingCustomer(null)}>
          Back to Register
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome to the Stamp Book!</h2>
      <p>Register to collect your first stamp.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="111-222-3333"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input type="checkbox" id="privacy-policy" required />
          <label htmlFor="privacy-policy">
            I agree to the <a href="#">Privacy Policy</a>.
          </label>
        </div>
        <button type="submit">Register & Get Stamp</button>
      </form>
    </div>
  );
}

export default CustomerView;
