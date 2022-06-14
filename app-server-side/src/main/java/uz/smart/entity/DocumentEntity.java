package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021.
*/

import lombok.*;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "documents")
public class DocumentEntity extends BaseEntity {
  private UUID mainPhotoId;
  private String title;
  private Timestamp date;
  private String comment;

  @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<Attachment> attachments;

  public DocumentEntity(String title, Timestamp date, String comment) {
    this.title = title;
    this.date = date;
    this.comment = comment;
  }
}
