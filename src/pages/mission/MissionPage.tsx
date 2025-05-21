// src/pages/MissionPage.tsx
import { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import MissionTemplateTab from '@/pages/mission/MissionTemplateTab';
import MissionCategoryTab from '@/pages/mission/MissionCategoryTab';
import { fetchCategories, MissionCategoryResponse } from '@/services/categoryService';

const { TabPane } = Tabs;

const MissionPage = () => {
  const [categories, setCategories] = useState<MissionCategoryResponse[]>([]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      message.error('카테고리 불러오기 실패');
    }
  };

  useEffect(() => {
    loadCategories(); // ✅ 처음 1회만 실행
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Tabs>
        <TabPane tab="🧩 미션 템플릿" key="template">
          <MissionTemplateTab categories={categories} />
        </TabPane>
        <TabPane tab="⚙️ 카테고리 & 설정" key="meta">
          <MissionCategoryTab onCategoryChange={loadCategories} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MissionPage;