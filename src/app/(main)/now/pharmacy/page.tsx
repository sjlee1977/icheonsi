'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'

interface MedicalItem {
  id: string
  name: string
  address: string
  tel: string
  open: boolean
}

const REGIONS = [
  '전체', '장호원읍', '부발읍', '신둔면', '백사면', '호법면', '마장면', '대월면', '모가면', '설성면', '율면', 
  '창전동', '관고동', '중리동', '증포동'
]

export default function PharmacyPage() {
  const [pharmacies, setPharmacies] = useState<MedicalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [regionFilter, setRegionFilter] = useState('전체')

  const fetchPharmacies = useCallback(async () => {
    try {
      const res = await fetch('/api/med-now')
      const data = await res.json()
      setPharmacies(data.pharmacy || [])
    } catch { /* 빈 배열 유지 */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPharmacies() }, [fetchPharmacies])

  const filteredPharmacies = useMemo(() => {
    let list = pharmacies
    if (regionFilter !== '전체') {
      list = list.filter(p => p.address.includes(regionFilter))
    }
    return list
  }, [pharmacies, regionFilter])

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">ICHEON NOW</span>
        <h1 className="page-title">이천 약국 정보</h1>
        <p className="page-desc">이천시 전역의 실시간 영업 정보와 약국 목록을 확인하세요.</p>
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/now" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>
          ← 이천 나우로 돌아가기
        </Link>
      </div>

      <div className="filter-card">
        <div className="filter-header">
          <div className="filter-title-group">
            <h3>지역 탐색기</h3>
            <p>궁금한 지역을 선택하여 의료기관을 찾아보세요.</p>
          </div>
          <div className="list-count">
            검색 결과: <strong>{filteredPharmacies.length}</strong>곳
          </div>
        </div>
        
        <div className="region-chips-container">
          {REGIONS.map(r => (
            <button
              key={r}
              className={`region-chip ${regionFilter === r ? 'active' : ''}`}
              onClick={() => setRegionFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>
          <div className="pulse" style={{ margin: '0 auto 16px' }} />
          데이터를 불러오는 중입니다…
        </div>
      ) : filteredPharmacies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>
          <p>해당 지역에 등록된 약국 정보가 없습니다.</p>
        </div>
      ) : (
        <div className="medical-list">
          {filteredPharmacies.map((item) => (
            <div key={item.id} className="medical-item">
              <div className="medical-item-header">
                <div className="medical-name-row">
                  <span className="medical-name">{item.name}</span>
                  {item.open && <span className="badge-open">영업중</span>}
                </div>
              </div>
              <div className="medical-address">📍 {item.address}</div>
              {item.tel && (
                <div className="medical-tel">
                  <a href={`tel:${item.tel}`}>📞 {item.tel}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
