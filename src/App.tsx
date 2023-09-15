import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { usePapaParse } from 'react-papaparse';
import ObjectVisualizer, { TextPosition } from './components/object-visualer';
import './index.css';
Modal.setAppElement('#yourAppElement');

export default function App() {
  const { readString } = usePapaParse();
  const [records, setRecords] = useState<TrainLabel[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<TrainLabel>();

  useEffect(() => {
    fetch('train_labels.csv')
      .then((response) => response.text())
      .then((text) => {
        readString<TrainLabel>(text, {
          worker: true,
          header: true,
          dynamicTyping: true,
          delimiter: ',',
          complete: (results) => {
            setRecords(results.data);
            const labels = new Set(results.data.map((record) => record.Label));
            setFilters(Array.from(labels));
          },
        });
      })
      .catch((error) => console.error(error));
  }, []);

  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = (record: TrainLabel) => {
    setSelectedRecord(record);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFilterChange = (event: any) => {
    event.preventDefault();
    setSelectedFilter(event.target.value);
  };

  return (
    <>
      <div className='p-5'>
        <label htmlFor='filterDropdown'>Filter by Label:</label>
        <select
          id='filterDropdown'
          onChange={(e) => handleFilterChange(e)}
          value={selectedFilter}
        >
          <option value='All'>All</option>
          {filters.map((filter) => {
            return (
              <option value={filter} key={filter}>
                {filter}
              </option>
            );
          })}
        </select>
      </div>
      <div className='flex flex-col m-5 border rounded-lg'>
        <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
            <div className='overflow-hidden'>
              <table className='min-w-full text-left text-sm font-light'>
                <thead className='border-b font-medium dark:border-neutral-500'>
                  <tr>
                    <th scope='col' className='px-6 py-4'>
                      Image Name
                    </th>
                    <th scope='col' className='px-6 py-4'>
                      Label
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records
                    .filter(
                      (record) =>
                        selectedFilter === 'All' ||
                        record.Label === selectedFilter
                    )
                    .map((record: TrainLabel) => {
                      return (
                        <tr
                          key={record.Img_Name}
                          className='border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'
                          onClick={() => openModal(record)}
                        >
                          <td className='whitespace-nowrap px-6 py-4 font-medium'>
                            {record.Img_Name}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4'>
                            {record.Label}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
      >
        <button onClick={closeModal}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
        <ObjectVisualizer
          annotations={[
            {
              label: selectedRecord?.Label || '',
              coordinates: {
                x: selectedRecord?.Left ? selectedRecord?.Left : 0,
                y: selectedRecord?.Top ? selectedRecord.Top : 0,
                height: selectedRecord?.Height || 0,
                width: selectedRecord?.Width || 0,
              },
            },
          ]}
          image={`/train_images/${selectedRecord?.Img_Name}`}
          boundingBoxStyles={{
            boundingBoxOpacity: 0.2,
            boudingBoxStroke: 'red',
            boundingBoxTextColor: 'black',
            boudingBoxFill: 'red',
            boundingBoxTextFont: '18px Arial',
            boundingBoxTextPosition: TextPosition.BottomRight,
          }}
        />
      </Modal>
    </>
  );
}
