'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface MedicalItem {
  id: string
  name: string
  address: string
  tel: string
  type: string
}

export default function PharmacyPage() {
  const [pharmacies, setPharmacies] = useState<MedicalItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPharmacies = useCallback(async () => {
    try {
      const res = await fetch('/api/hospitals?type=pharmacy')
      setPharmacies((await res.json()).list ?? [])
    } catch { /* 빈 배열 유지 */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPharmacies() }, [fetchPharmacies])

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">ICHEON NOW</span>
        <h1 className="page-title">이천 약국 정보</h1>
        <p className="page-desc">이천시 등록 약국 목록</p>
      </header>

      <div style={{ marginBottom: '1rem' }}>
        <Link href="/now" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          ← 이천 나우로 돌아가기
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          데이터 불러오는 중…
        </div>
      ) : pharmacies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <p>데이터를 불러올 수 없습니다.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>PUBLIC_DATA_API_KEY를 확인하세요.</p>
        </div>
      ) : (
        <div className="medical-list">
          {pharmacies.map((item) => (
            <div key={item.id} className="medical-item">
              <div className="medical-item-header">
                <span className="medical-name">{item.name}</span>
                <span className="medical-type">{item.type}</span>
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
