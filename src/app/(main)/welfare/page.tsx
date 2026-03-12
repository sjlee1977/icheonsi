'use client'

import { useState } from 'react'

type Target = 'all' | 'senior' | 'disabled' | 'child' | 'youth' | 'lowIncome'
type Category = 'all' | 'money' | 'health' | 'care' | 'housing' | 'education'

interface WelfareItem {
  id: string
  title: string
  desc: string
  target: Target[]
  category: Category[]
  contact: string
  url?: string
}

const WELFARE_DATA: WelfareItem[] = [
  { id: '1', title: '기초생활수급자 생계급여', desc: '소득인정액이 기준 중위소득 30% 이하인 가구에 생계비 지급', target: ['lowIncome'], category: ['money'], contact: '031-644-2000', url: 'https://www.bokjiro.go.kr' },
  { id: '2', title: '노인 맞춤 돌봄 서비스', desc: '65세 이상 독거·취약 노인에게 안전 확인·생활 교육·서비스 연계', target: ['senior'], category: ['care'], contact: '031-637-4000' },
  { id: '3', title: '장애인 활동 지원', desc: '장애 정도가 심한 장애인에게 활동보조·방문목욕·방문간호 서비스', target: ['disabled'], category: ['care'], contact: '031-644-2000' },
  { id: '4', title: '아동 수당', desc: '8세 미만 아동 1인당 월 10만 원 지급', target: ['child'], category: ['money'], contact: '031-644-2000', url: 'https://www.bokjiro.go.kr' },
  { id: '5', title: '청년 월세 한시 특별 지원', desc: '독립 거주 무주택 청년에게 월 최대 20만 원, 12개월 지원', target: ['youth'], category: ['housing'], contact: '031-644-4000' },
  { id: '6', title: '노인 의료비 지원', desc: '65세 이상 저소득 노인 의료급여 및 본인부담 경감', target: ['senior', 'lowIncome'], category: ['health'], contact: '031-644-2000' },
  { id: '7', title: '영유아 보육료 지원', desc: '0~5세 아동 어린이집 보육료 전액 또는 일부 지원', target: ['child'], category: ['education', 'money'], contact: '031-644-3000' },
  { id: '8', title: '장애인 의료비 지원', desc: '등록 장애인 의료급여 2종 적용 및 본인부담 감면', target: ['disabled'], category: ['health'], contact: '031-644-2000' },
  { id: '9', title: '청년 취업 지원 프로그램', desc: '이천시 거주 청년 직업훈련·취업 연계·면접 지원비 지급', target: ['youth'], category: ['money'], contact: '031-644-4500' },
  { id: '10', title: '저소득층 주거급여', desc: '임차가구 임대료, 자가가구 수선유지비 지원', target: ['lowIncome'], category: ['housing'], contact: '031-644-2000', url: 'https://www.bokjiro.go.kr' },
  { id: '11', title: '아이행복카드 (보육·유아교육)', desc: '어린이집 또는 유치원 이용 아동 바우처 지원', target: ['child'], category: ['education'], contact: '1577-0756' },
  { id: '12', title: '노인 일자리 및 사회활동 지원', desc: '60세 이상 노인 공공·민간 일자리 연계, 월 최대 29만 원', target: ['senior'], category: ['money'], contact: '031-637-4000' },
]

const TARGET_LABELS: Record<string, string> = {
  all: '전체', senior: '노인 (65세 이상)', disabled: '장애인',
  child: '아동·가족', youth: '청년 (19~34세)', lowIncome: '저소득층',
}
const CATEGORY_LABELS: Record<string, string> = {
  all: '전체', money: '경제 지원', health: '의료·건강',
  care: '돌봄 서비스', housing: '주거', education: '교육',
}

export default function WelfarePage() {
  const [target, setTarget] = useState<Target>('all')
  const [category, setCategory] = useState<Category>('all')
  const [searched, setSearched] = useState(false)

  const results = WELFARE_DATA.filter((item) => {
    const targetMatch = target === 'all' || item.target.includes(target)
    const catMatch = category === 'all' || item.category.includes(category)
    return targetMatch && catMatch
  })

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">WELFARE HUB</span>
        <h1 className="page-title">이천시 복지 허브</h1>
        <p className="page-desc">나에게 맞는 복지 혜택을 3번의 클릭으로 찾아드립니다</p>
      </header>

      <section className="welfare-finder-section">
        <div className="welfare-card">
          <h2>나의 맞춤 혜택 찾기</h2>
          <div className="welfare-form">
            <div className="form-group">
              <label htmlFor="welfare-target">대상</label>
              <select id="welfare-target" value={target} onChange={(e) => setTarget(e.target.value as Target)}>
                {Object.entries(TARGET_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="welfare-category">분야</label>
              <select id="welfare-category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <button className="btn-primary welfare-search-btn" onClick={() => setSearched(true)}>조회하기</button>
          </div>

          {!searched ? (
            <div className="welfare-result">조건을 선택하고 조회하기를 누르세요.</div>
          ) : results.length === 0 ? (
            <div className="welfare-result">해당 조건의 복지 혜택이 없습니다. 이천시 복지상담 031-644-2000 으로 문의하세요.</div>
          ) : (
            <div className="welfare-results-list">
              <p className="welfare-result-count">{results.length}개의 혜택을 찾았습니다.</p>
              {results.map((item) => (
                <div key={item.id} className="welfare-result-item">
                  <div className="welfare-result-header">
                    <strong>{item.title}</strong>
                    <div className="welfare-tags">
                      {item.target.map(t => <span key={t} className="welfare-tag target">{TARGET_LABELS[t]}</span>)}
                      {item.category.map(c => <span key={c} className="welfare-tag category">{CATEGORY_LABELS[c]}</span>)}
                    </div>
                  </div>
                  <p>{item.desc}</p>
                  <div className="welfare-result-footer">
                    <span>📞 {item.contact}</span>
                    {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">신청하기 →</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="emergency-welfare">
        <h2 className="section-title">긴급 복지 연락처</h2>
        <div className="contact-grid">
          <div className="contact-card"><span className="contact-icon">📞</span><h4>이천시 복지상담</h4><p>031-644-2000</p></div>
          <div className="contact-card"><span className="contact-icon">🏥</span><h4>긴급복지지원</h4><p>129</p></div>
          <div className="contact-card"><span className="contact-icon">👴</span><h4>노인맞춤돌봄</h4><p>031-637-4000</p></div>
          <div className="contact-card"><span className="contact-icon">👶</span><h4>아이행복콜</h4><p>1577-0756</p></div>
        </div>
      </section>
    </div>
  )
}