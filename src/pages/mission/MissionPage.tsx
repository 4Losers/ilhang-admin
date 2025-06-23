// src/pages/MissionPage.tsx
import { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import MissionTemplateTab from '@/pages/mission/MissionTemplateTab';
import MissionCategoryTab from '@/pages/mission/MissionCategoryTab';
import { fetchCategories, MissionCategoryResponse } from '@/services/categoryService';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';

const { TabPane } = Tabs;

const MissionPage = () => {
  const [categories, setCategories] = useState<MissionCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
      message.error('카테고리 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(); // ✅ 처음 1회만 실행
  }, []);

  const handleRefresh = () => {
    loadCategories();
    message.success('카테고리가 새로고침되었습니다.');
  };

  return (
    <PageLayout>
      <PageHeader
        title="🧩 미션 관리"
        subtitle="미션 템플릿과 카테고리를 관리하세요"
        onRefresh={handleRefresh}
        refreshLoading={loading}
      />

      <Tabs>
        <TabPane tab="🧩 미션 템플릿" key="template">
          <MissionTemplateTab categories={categories} />
        </TabPane>
        <TabPane tab="⚙️ 카테고리 & 설정" key="meta">
          <MissionCategoryTab onCategoryChange={loadCategories} />
        </TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default MissionPage;