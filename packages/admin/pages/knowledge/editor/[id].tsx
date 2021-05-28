import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import cls from 'classnames';
import { CloseOutlined, DeleteOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Divider, Input, Button, Popconfirm, Popover, Modal, message } from 'antd';
import { SortableHandle, SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { KnowledgeProvider } from '@/providers/knowledge';
import { Editor } from '@/components/Editor';
import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { useToggle } from '@/hooks/useToggle';
import styles from './index.module.scss';

const DragHandle = SortableHandle(() => <span>::</span>);

interface IProps {
  id: string | number;
  knowledge: Partial<IKnowledge>;
}

// const Page: NextPage<IProps> = ({ id, knowledge }) => {
//   const forceUpdate = useForceUpdate();
//   const [loading, setLoading] = useState(false);
//   const [popVisible, togglePopVisible] = useToggle(false);
//   const [fileVisible, toggleFileVisible] = useToggle(false);
//   const [newTitle, setNewTitle] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const [chapters, setChapters] = useState<Array<Partial<IKnowledge>>>(knowledge.children || []);
//   const currentChapter = chapters[currentIndex] || null;

//   const deleteKnowledge = useCallback(
//     (idx) => {
//       const handle = () => {
//         setChapters((chapters) => {
//           chapters.splice(idx, 1);
//           return chapters;
//         });
//         forceUpdate();
//         setCurrentIndex(currentIndex - 1);
//       };
//       const target = chapters[idx];
//       if (target.id) {
//         KnowledgeProvider.deleteKnowledge(target.id).then(() => {
//           handle();
//           message.success('已保存');
//         });
//       } else {
//         handle();
//       }
//     },
//     [chapters, currentIndex, forceUpdate]
//   );

//   const SortableItem = SortableElement(({ value: idx }) => (
//     <li
//       key={idx}
//       className={cls({ [styles.active]: idx === currentIndex, [styles.item]: true })}
//       onClick={() => setCurrentIndex(idx)}
//     >
//       <DragHandle />
//       <span>{chapters[idx].title}</span>
//       <Popconfirm
//         title="确认删除?"
//         onConfirm={() => deleteKnowledge(idx)}
//         okText="确定"
//         cancelText="取消"
//       >
//         <DeleteOutlined onClick={(e) => e.stopPropagation()} />
//       </Popconfirm>
//     </li>
//   ));

//   const SortableList = SortableContainer(({ items }) => {
//     return (
//       <ul className={styles.menu}>
//         {items.map((_, index) => (
//           <SortableItem key={`item-${index}`} index={index} value={index} />
//         ))}
//       </ul>
//     );
//   });

//   const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
//     setChapters((chapters) => {
//       return arrayMove(chapters, oldIndex, newIndex);
//     });
//   }, []);

//   const createNewKnowledge = useCallback(() => {
//     const title = newTitle.trim();
//     if (!title) {
//       return;
//     }
//     setChapters((chapters) => {
//       chapters.push({
//         title: title,
//         content: '',
//       });
//       return chapters;
//     });
//     setCurrentIndex(chapters.length - 1);
//     setNewTitle('');
//     togglePopVisible();
//     forceUpdate();
//   }, [newTitle, chapters, forceUpdate, togglePopVisible]);

//   const patchKnowledge = useCallback(
//     (patch) => {
//       if (currentIndex < 0) {
//         return;
//       }
//       setChapters((chapters) => {
//         const target = chapters[currentIndex];
//         if (!target) {
//           return chapters;
//         }
//         target.content = patch.value;
//         target.html = patch.html;
//         target.toc = patch.toc;
//         return chapters;
//       });
//     },
//     [currentIndex]
//   );

//   const save = useCallback(() => {
//     if (!chapters || !chapters.length) {
//       return;
//     }
//     chapters.forEach((chapter, idx) => {
//       chapter.order = idx;
//     });
//     setLoading(true);
//     const promises = chapters.map((chapter) => {
//       if (chapter.parentId) {
//         return KnowledgeProvider.updateKnowledge(chapter.id, chapter);
//       }
//       return KnowledgeProvider.createChapters([{ ...chapter, parentId: id }]);
//     });
//     Promise.all(promises as Array<Promise<IKnowledge>>).then((res) => {
//       const data = res.flat(Infinity);
//       setChapters(data);
//       forceUpdate();
//       setLoading(false);
//     });
//   }, [id, chapters, forceUpdate]);

//   return (
//     <div className={styles.wrap}>
//       <aside className={styles.aside}>
//         <header>
//           <div>
//             <Avatar shape="square" size="large" src={knowledge.cover} />
//             <span style={{ marginLeft: 8 }}>{knowledge.title}</span>
//           </div>
//           <Popconfirm
//             title="确认关闭？如果有内容变更，请先保存。"
//             onConfirm={() => Router.push('/knowledge')}
//             onCancel={() => null}
//             okText="确认"
//             cancelText="取消"
//             placement="rightBottom"
//           >
//             <CloseOutlined />
//           </Popconfirm>
//         </header>
//         <Divider type="horizontal" />
//         <main>
//           {chapters.length > 0 ? (
//             <div className={cls(styles.action, styles.saveAction)}>
//               <span>{chapters.length}篇文章</span>
//               <Button size="small" type="primary" onClick={save} loading={loading}>
//                 保存
//               </Button>
//             </div>
//           ) : null}
//           <Popover
//             content={
//               <div style={{ display: 'flex' }}>
//                 <Input
//                   autoFocus={true}
//                   width={240}
//                   value={newTitle}
//                   onChange={(e) => setNewTitle(e.target.value)}
//                 />
//                 <Button style={{ marginLeft: 8 }} type="primary" onClick={createNewKnowledge}>
//                   新建
//                 </Button>
//               </div>
//             }
//             visible={popVisible}
//             onVisibleChange={togglePopVisible}
//             placement="rightTop"
//             trigger="click"
//           >
//             <div className={styles.action}>
//               <span>新建</span>
//               <PlusOutlined />
//             </div>
//           </Popover>
//           <div className={styles.action} onClick={toggleFileVisible}>
//             <span>文件</span>
//             <FolderOutlined />
//           </div>
//           <FileSelectDrawer isCopy={true} visible={fileVisible} onClose={toggleFileVisible} />
//         </main>
//         <Divider type="horizontal" />
//         <footer>
//           <SortableList items={chapters} onSortEnd={onSortEnd} useDragHandle={true} />
//         </footer>
//       </aside>
//       <main className={styles.main}>
//         {currentChapter ? (
//           <Editor
//             defaultValue={(currentChapter && currentChapter.content) || ''}
//             onChange={patchKnowledge}
//           />
//         ) : (
//           <div className={styles.helper}>请新建章节（或者选择章节进行编辑）</div>
//         )}
//       </main>
//     </div>
//   );
// };

const Page: NextPage<IProps> = ({ id, knowledge }) => {
  const forceUpdate = useForceUpdate();
  const [loading, setLoading] = useState(false);
  const [popVisible, togglePopVisible] = useToggle(false);
  const [fileVisible, toggleFileVisible] = useToggle(false);
  const [newTitle, setNewTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [chapters, setChapters] = useState<Array<Partial<IKnowledge>>>(knowledge.children || []);
  const currentChapter = chapters[currentIndex] || null;

  const deleteKnowledge = useCallback(
    (idx) => {
      const handle = () => {
        setChapters((chapters) => {
          chapters.splice(idx, 1);
          return chapters;
        });
        forceUpdate();
        setCurrentIndex(currentIndex - 1);
      };
      const target = chapters[idx];
      if (target.id) {
        KnowledgeProvider.deleteKnowledge(target.id).then(() => {
          handle();
          message.success('已保存');
        });
      } else {
        handle();
      }
    },
    [chapters, currentIndex, forceUpdate]
  );

  const SortableItem = SortableElement(({ value: idx }) => (
    <li
      key={idx}
      className={cls({ [styles.active]: idx === currentIndex, [styles.item]: true })}
      onClick={() => setCurrentIndex(idx)}
    >
      <DragHandle />
      <span>{chapters[idx].title}</span>
      <Popconfirm
        title="确认删除?"
        onConfirm={() => deleteKnowledge(idx)}
        okText="确定"
        cancelText="取消"
      >
        <DeleteOutlined onClick={(e) => e.stopPropagation()} />
      </Popconfirm>
    </li>
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <ul className={styles.menu}>
        {items.map((_, index) => (
          <SortableItem key={`item-${index}`} index={index} value={index} />
        ))}
      </ul>
    );
  });

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    setChapters((chapters) => {
      return arrayMove(chapters, oldIndex, newIndex);
    });
  }, []);

  const createNewKnowledge = useCallback(() => {
    const title = newTitle.trim();
    if (!title) {
      return;
    }
    setChapters((chapters) => {
      chapters.push({
        title: title,
        content: '',
      });
      return chapters;
    });
    setCurrentIndex(chapters.length - 1);
    setNewTitle('');
    togglePopVisible();
    forceUpdate();
  }, [newTitle, chapters, forceUpdate, togglePopVisible]);

  const patchKnowledge = useCallback(
    (patch) => {
      if (currentIndex < 0) {
        return;
      }
      setChapters((chapters) => {
        const target = chapters[currentIndex];
        if (!target) {
          return chapters;
        }
        target.content = patch.value;
        target.html = patch.html;
        target.toc = patch.toc;
        return chapters;
      });
    },
    [currentIndex]
  );

  const save = useCallback(() => {
    if (!chapters || !chapters.length) {
      return;
    }
    chapters.forEach((chapter, idx) => {
      chapter.order = idx;
    });
    setLoading(true);
    const promises = chapters.map((chapter) => {
      if (chapter.parentId) {
        return KnowledgeProvider.updateKnowledge(chapter.id, chapter);
      }
      return KnowledgeProvider.createChapters([{ ...chapter, parentId: id }]);
    });
    Promise.all(promises as Array<Promise<IKnowledge>>).then((res) => {
      const data = res.flat(Infinity);
      setChapters(data);
      forceUpdate();
      setLoading(false);
    });
  }, [id, chapters, forceUpdate]);

  return (
    <div className={styles.wrapper}>
      <header>
        <div>
          <Popconfirm
            title="确认关闭？如果有内容变更，请先保存。"
            onConfirm={() => Router.push('/knowledge')}
            onCancel={() => null}
            okText="确认"
            cancelText="取消"
            placement="rightBottom"
          >
            <Button size="small" icon={<CloseOutlined />} style={{ marginRight: 12 }} />
          </Popconfirm>
          <Avatar shape="square" src={knowledge.cover} />
          <span style={{ marginLeft: 8 }}>{knowledge.title}</span>
        </div>
        <div>
          <Button type="primary" onClick={save} loading={loading}>
            保存
          </Button>
        </div>
      </header>
      <main>
        <aside>
          <header>
            <span>{chapters.length}篇文章</span>
            <Popover
              content={
                <div style={{ display: 'flex' }}>
                  <Input
                    autoFocus={true}
                    width={240}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Button style={{ marginLeft: 8 }} type="primary" onClick={createNewKnowledge}>
                    新建
                  </Button>
                </div>
              }
              visible={popVisible}
              onVisibleChange={togglePopVisible}
              placement="rightTop"
              trigger="click"
            >
              <Button icon={<PlusOutlined />} size="small">
                新建
              </Button>
            </Popover>
          </header>
          <main>
            <SortableList items={chapters} onSortEnd={onSortEnd} useDragHandle={true} />
          </main>
        </aside>
        <section>
          {currentChapter ? (
            <Editor
              defaultValue={(currentChapter && currentChapter.content) || ''}
              onChange={patchKnowledge}
            />
          ) : (
            <div className={styles.helper}>请新建章节（或者选择章节进行编辑）</div>
          )}
        </section>
      </main>
    </div>
  );
};

Page.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const knowledge = await KnowledgeProvider.getKnowledge(id);
  return { id, knowledge } as { id: string | number; knowledge: IKnowledge };
};

export default Page;
