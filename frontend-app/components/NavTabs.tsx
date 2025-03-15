import { useState } from 'react';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <div
      className={`px-4 py-2 cursor-pointer border-b-2 font-medium text-sm ${
        active 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

interface NavTabsProps {
  children: React.ReactNode[];
  labels: string[];
}

const NavTabs: React.FC<NavTabsProps> = ({ children, labels }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Ensure we have labels for all children
  if (children.length !== labels.length) {
    console.error('NavTabs: Number of children must match number of labels');
    return <div>Error: NavTabs configuration error</div>;
  }

  return (
    <div>
      <div className="border-b border-gray-200 flex space-x-4 mb-6 overflow-x-auto">
        {labels.map((label, index) => (
          <Tab 
            key={index} 
            label={label} 
            active={activeTab === index} 
            onClick={() => setActiveTab(index)}
          />
        ))}
      </div>
      
      <div>
        {children.map((child, index) => (
          <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavTabs; 