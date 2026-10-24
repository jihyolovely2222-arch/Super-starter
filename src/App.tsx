import React, { useState, useEffect, useMemo } from 'react';
import { Member, Season, ViewMode } from './types';
import {
  subscribeToSeasons,
  saveSeasonDoc,
  deleteSeasonDoc,
  validateFirestoreConnection
} from './firebase';
import { INITIAL_SEASONS } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { SeasonBanner } from './components/SeasonBanner';
import { FilterBar } from './components/FilterBar';
import { MemberCard } from './components/MemberCard';
import { PodiumStage } from './components/PodiumStage';
import { MemberModal } from './components/MemberModal';
import { SeasonModal } from './components/SeasonModal';
import { MemberDetailModal } from './components/MemberDetailModal';
import { ExportImportModal } from './components/ExportImportModal';
import { FolderOpen, Plus, Cloud, CloudCheck } from 'lucide-react';

export default function App() {
  const [seasons, setSeasons] = useState<Season[]>(INITIAL_SEASONS);
  const [activeSeasonId, setActiveSeasonId] = useState<string>('s1');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState<'rank-asc' | 'rank-desc' | 'name' | 'votes'>('rank-asc');

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Connect to Firestore on mount
  useEffect(() => {
    validateFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = subscribeToSeasons(
      (firestoreSeasons) => {
        setIsLoading(false);
        if (firestoreSeasons.length > 0) {
          setSeasons(firestoreSeasons);
          setActiveSeasonId((prev) => {
            const exists = firestoreSeasons.some((s) => s.id === prev);
            return exists ? prev : firestoreSeasons[0].id;
          });
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Active Season
  const activeSeason = useMemo(() => {
    return seasons.find((s) => s.id === activeSeasonId) || seasons[0] || null;
  }, [seasons, activeSeasonId]);

  // Filtered and Sorted Members for Active Season
  const filteredMembers = useMemo(() => {
    if (!activeSeason) return [];
    const query = searchQuery.trim().toLowerCase();

    return activeSeason.members
      .filter((m) => {
        // Country filter
        if (selectedCountry && m.country !== selectedCountry) {
          return false;
        }

        // Search query filter
        if (query) {
          const matchNameTh = m.nameTh.toLowerCase().includes(query);
          const matchNameEn = m.nameEn?.toLowerCase().includes(query) || false;
          const matchNickname = m.nickname.toLowerCase().includes(query);
          const matchCountry = m.country.toLowerCase().includes(query);
          const matchRole = m.role?.toLowerCase().includes(query) || false;
          const matchMbti = m.mbti?.toLowerCase().includes(query) || false;
          if (!matchNameTh && !matchNameEn && !matchNickname && !matchCountry && !matchRole && !matchMbti) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rank-asc') return a.rank - b.rank;
        if (sortBy === 'rank-desc') return b.rank - a.rank;
        if (sortBy === 'votes') return (b.finalVotes || 0) - (a.finalVotes || 0);
        if (sortBy === 'name') return a.nameTh.localeCompare(b.nameTh, 'th');
        return a.rank - b.rank;
      });
  }, [activeSeason, searchQuery, selectedCountry, sortBy]);

  // Season Handlers
  const handleSelectSeason = (id: string) => {
    setActiveSeasonId(id);
    setSelectedCountry('');
    setSearchQuery('');
  };

  const handleOpenAddSeason = () => {
    setEditingSeason(null);
    setIsSeasonModalOpen(true);
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setIsSeasonModalOpen(true);
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (seasons.length <= 1) {
      alert('ไม่สามารถลบซีซันเดียวที่มีอยู่ในระบบได้');
      return;
    }
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบซีซันนี้ พร้อมรายชื่อสมาชิกทั้งหมด?')) {
      try {
        await deleteSeasonDoc(seasonId);
      } catch (e) {
        console.error('Failed to delete season from Firestore', e);
      }
    }
  };

  const handleSaveSeason = async (seasonData: Partial<Season>, editId?: string) => {
    if (editId) {
      const target = seasons.find((s) => s.id === editId);
      if (target) {
        const updated: Season = { ...target, ...seasonData };
        await saveSeasonDoc(updated);
      }
    } else {
      const newSeason: Season = {
        id: 's_' + Date.now(),
        seasonNumber: seasons.length + 1,
        seasonName: seasonData.seasonName || `Season ${seasons.length + 1}`,
        groupName: seasonData.groupName || 'NEW GROUP',
        groupType: seasonData.groupType || 'girl_group',
        fandomName: seasonData.fandomName,
        members: [],
      };
      await saveSeasonDoc(newSeason);
      setActiveSeasonId(newSeason.id);
    }
  };

  // Member Handlers
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!activeSeason) return;
    if (confirm('ต้องการลบข้อมูลสมาชิกคนนี้ออกจากทำเนียบเดบิวต์ใช่หรือไม่?')) {
      const updatedSeason: Season = {
        ...activeSeason,
        members: activeSeason.members.filter((m) => m.id !== memberId),
      };
      await saveSeasonDoc(updatedSeason);
      if (detailMember?.id === memberId) {
        setDetailMember(null);
      }
    }
  };

  const handleSaveMember = async (memberData: Omit<Member, 'id'>, editId?: string) => {
    if (!activeSeason) return;

    let updatedMembers: Member[];
    if (editId) {
      updatedMembers = activeSeason.members.map((m) =>
        m.id === editId ? { ...memberData, id: editId } : m
      );
    } else {
      const newMember: Member = {
        ...memberData,
        id: 'm_' + Date.now(),
      };
      updatedMembers = [...activeSeason.members, newMember];
    }

    const updatedSeason: Season = {
      ...activeSeason,
      members: updatedMembers,
    };

    await saveSeasonDoc(updatedSeason);
  };

  const handleResetData = async () => {
    for (const s of INITIAL_SEASONS) {
      await saveSeasonDoc(s);
    }
    setActiveSeasonId(INITIAL_SEASONS[0].id);
    setSelectedCountry('');
    setSearchQuery('');
  };

  const handleImportSeasons = async (imported: Season[]) => {
    for (const s of imported) {
      await saveSeasonDoc(s);
    }
    setActiveSeasonId(imported[0].id);
  };

  return (
    <div className="min-h-screen academy-gradient text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onOpenAddMember={handleOpenAddMember}
        onOpenAddSeason={handleOpenAddSeason}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSeason ? (
          <>
            {/* Season Info Banner */}
            <SeasonBanner
              seasons={seasons}
              activeSeason={activeSeason}
              onSelectSeason={handleSelectSeason}
              onOpenAddSeason={handleOpenAddSeason}
              onEditSeason={handleEditSeason}
              onDeleteSeason={handleDeleteSeason}
              onOpenAddMember={handleOpenAddMember}
            />

            {/* Filter and Search Controls */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              sortBy={sortBy}
              onSortChange={setSortBy}
              allMembers={activeSeason.members}
            />

            {/* Members Views: Cards and Podium */}
            {filteredMembers.length > 0 ? (
              <>
                {viewMode === 'cards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                        onViewDetails={setDetailMember}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'podium' && (
                  <PodiumStage
                    members={filteredMembers}
                    onViewDetails={setDetailMember}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                  />
                )}
              </>
            ) : (
              /* Empty State */
              <div className="rounded-3xl p-12 text-center border border-white/10 bg-slate-900/40 backdrop-blur-md max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {searchQuery || selectedCountry
                    ? 'ไม่พบข้อมูลสมาชิกตามเงื่อนไขการค้นหา'
                    : 'ยังไม่มีข้อมูลสมาชิกในซีซันนี้'}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {searchQuery || selectedCountry
                    ? 'ลองปรับเปลี่ยนคำค้นหา หรือล้างตัวกรองสัญชาติ'
                    : 'เพิ่มสมาชิกคนแรกเพื่อเริ่มต้นบันทึกทำเนียบเกียรติยศ'}
                </p>

                {searchQuery || selectedCountry ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCountry('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
                  >
                    ล้างการค้นหาทั้งหมด
                  </button>
                ) : (
                  <button
                    onClick={handleOpenAddMember}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-xs font-medium text-white shadow-md flex items-center gap-1.5 mx-auto transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มสมาชิกคนแรก</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400">
              {isLoading ? 'กำลังโหลดข้อมูลจาก Firestore...' : 'ไม่พบข้อมูลซีซันในระบบ'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 bg-slate-950/70 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">SEISHUN ACADEMY</span>
            <span>·</span>
            <span>青春アカデミー Debut Group Archive & Hall of Fame</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              เชื่อมต่อ Firebase Firestore เรียบร้อยแล้ว
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
        suggestedRank={activeSeason ? activeSeason.members.length + 1 : 1}
      />

      <SeasonModal
        isOpen={isSeasonModalOpen}
        onClose={() => setIsSeasonModalOpen(false)}
        onSave={handleSaveSeason}
        editingSeason={editingSeason}
      />

      <MemberDetailModal
        member={detailMember}
        onClose={() => setDetailMember(null)}
        onEdit={(m) => {
          setDetailMember(null);
          handleEditMember(m);
        }}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        seasons={seasons}
        onImport={handleImportSeasons}
        onReset={handleResetData}
      />
    </div>
  );
}
