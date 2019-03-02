# coding=utf-8
from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.mail import send_mail
from .thumbs import ImageWithThumbsField
# Create your models here.


class Informations(models.Model):
    about = models.TextField(verbose_name=_('O nas'))
    tehnic = models.TextField(verbose_name=_('Technika'))
    visible = models.BooleanField(default=False,verbose_name=_('Under construction?'))


    def save(self, *args, **kwargs):
        if Informations.objects.count() <=1:
            return super(Informations, self).save(*args, **kwargs)
        else:
            return None

    def delete(self, *args, **kwargs):
        return None

    class Meta:
        verbose_name = 'Informacje o mnie'
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return 'O mnie'

class Pattern(models.Model):
    category = models.CharField(max_length=64, verbose_name=_('Kategoria'))

    class Meta:
        verbose_name = 'Wzór'
        verbose_name_plural = 'Wzory'

    def __unicode__(self):
        return  self.category


class PatternPhoto(models.Model):
    pattern_relation = models.ForeignKey(Pattern,related_name='pattern_relation')
    photo = ImageWithThumbsField(sizes=((640, 320), (1280, 718)), blank=True, null=True, verbose_name=_('Zdjęcie'))


    class Meta:
        verbose_name = 'Zdjęcie'
        verbose_name_plural = 'Zdjęcia'


def under_construction():
    if Informations.objects.all():
        I = Informations.objects.first()
        return I.visible
    else:
        return False


class Gallery(models.Model):
    title = models.CharField(max_length=64, verbose_name=_('Tytuł'), blank=True, null=True)
    description = models.TextField(verbose_name=_('Opis'), blank=True, null=True)

    class Meta:
        verbose_name= 'Galeria'
        verbose_name_plural = 'Galerie'

    def __unicode__(self):
        return self.title


class GalleryPhoto(models.Model):
    gallery_relation = models.ForeignKey(to=Gallery, related_name='gallery_relation')

    visible = models.BooleanField(default=under_construction, verbose_name=_('Under construction'))

    def save(self, *args, **kwargs):
        if Informations.objects.all():
            I = Informations.objects.first()
            I.visible = self.visible
            I.save()
        super(GalleryPhoto,self).save(*args, **kwargs)
#
    photo = ImageWithThumbsField(sizes=((640, 320), (1280, 718)), blank=True, null=True, verbose_name=_('Zdjęcie'))

class ContactForm(models.Model):
    email = models.EmailField(verbose_name=_('Email'))
    message = models.TextField(verbose_name=_('Wiadomość'))

    def __unicode__(self):
        return 'Wiadomość od %s' % self.email

    class Meta:
        verbose_name = verbose_name_plural = 'Wiadomości z formularza'

    def send_email(self):
        send_mail('Wiadomość od %s' % self.message, self.email, ('kontakt@stolarnia-zakopane.pl',))

    # def save(self, *args, **kwargs):
    #     self.send_email()
    #     return super(ContactForm,self).save(*args, **kwargs)